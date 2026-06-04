require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// You can provide a GITHUB_TOKEN in your .env to avoid rate limits
// e.g. GITHUB_TOKEN=ghp_xxxxxxxxxxxx
const githubToken = process.env.GITHUB_TOKEN;

async function fetchMergedPRs(owner, repo) {
    let page = 1;
    let allMergedPRs = [];
    let hasMore = true;

    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TechClub-Feedback-App'
    };
    
    if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
    }

    console.log(`Fetching merged PRs for ${owner}/${repo}...`);

    while (hasMore) {
        try {
            // Using the search API to find merged PRs for a specific repo
            // Search query: repo:owner/name is:pr is:merged
            const query = encodeURIComponent(`repo:${owner}/${repo} is:pr is:merged`);
            const url = `https://api.github.com/search/issues?q=${query}&per_page=100&page=${page}`;
            
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`GitHub API Error for ${owner}/${repo}:`, errorData.message);
                if (response.status === 403 && errorData.message.includes('rate limit')) {
                    console.log('Consider adding a GITHUB_TOKEN to your .env file to increase rate limits.');
                }
                break;
            }

            const data = await response.json();
            const items = data.items || [];
            
            allMergedPRs = allMergedPRs.concat(items);

            // The search API returns total_count. If we've fetched them all, stop.
            if (allMergedPRs.length >= data.total_count || items.length === 0) {
                hasMore = false;
            } else {
                page++;
                // Add a small delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (err) {
            console.error(`Error fetching PRs for ${owner}/${repo}:`, err);
            break;
        }
    }

    return allMergedPRs;
}

async function syncLeaderboard() {
    console.log('Starting GitHub PR sync...');

    try {
        // 1. Get all members who have a github_username
        const { data: members, error: membersError } = await supabase
            .from('members')
            .select('id, github_username')
            .not('github_username', 'is', null);

        if (membersError) throw membersError;
        
        if (!members || members.length === 0) {
            console.log('No members with a github_username found. Exiting.');
            return;
        }
        
        const memberMap = {}; // github_username (lowercase) -> member_id
        members.forEach(m => {
            if (m.github_username) {
                memberMap[m.github_username.toLowerCase()] = m.id;
            }
        });

        // 2. Get all tracked repositories
        const { data: repos, error: reposError } = await supabase
            .from('tracked_repos')
            .select('owner, repo');

        if (reposError) throw reposError;

        if (!repos || repos.length === 0) {
            console.log('No tracked repositories found. Exiting.');
            return;
        }

        // 3. Object to store PR counts per GitHub user
        // e.g. { "torvalds": 5, "defunkt": 2 }
        const prCounts = {};
        Object.keys(memberMap).forEach(username => prCounts[username] = 0);

        // 4. Fetch PRs for each tracked repo
        for (const r of repos) {
            const prs = await fetchMergedPRs(r.owner, r.repo);
            
            // Tally PRs by author
            for (const pr of prs) {
                if (pr.user && pr.user.login) {
                    const username = pr.user.login.toLowerCase();
                    // Only count if it's one of our members
                    if (prCounts[username] !== undefined) {
                        prCounts[username]++;
                    }
                }
            }
        }

        console.log('PR Counts tally complete:', prCounts);

        // 5. Update the leaderboard table
        console.log('Updating leaderboard in Supabase...');
        
        for (const [username, count] of Object.entries(prCounts)) {
            const memberId = memberMap[username];
            
            // Check if record exists
            const { data: existingRecord } = await supabase
                .from('leaderboard')
                .select('id')
                .eq('member_id', memberId)
                .single();

            if (existingRecord) {
                // Update
                await supabase
                    .from('leaderboard')
                    .update({ 
                        merged_prs: count, 
                        last_updated: new Date().toISOString() 
                    })
                    .eq('id', existingRecord.id);
            } else {
                // Insert
                await supabase
                    .from('leaderboard')
                    .insert([{ 
                        member_id: memberId, 
                        github_username: username, 
                        merged_prs: count 
                    }]);
            }
        }

        console.log('Leaderboard sync completed successfully!');

    } catch (err) {
        console.error('Error during sync:', err);
    }
}

// Run the sync
syncLeaderboard();
