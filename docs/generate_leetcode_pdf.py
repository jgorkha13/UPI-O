#!/usr/bin/env python3
"""Generate 150 LeetCode FAANG Prep PDF - 2 questions/day plan."""

from fpdf import FPDF

# Each entry: (num, title, difficulty, pattern, brute, optimal, explanation, java_brute, java_optimal)
PROBLEMS = [
    (1, "Two Sum", "Easy", "Hash Map",
     "Check every pair (i,j). Time O(n²), Space O(1).",
     "Store complement in HashMap as you scan. Time O(n), Space O(n).",
     "For each nums[i], check if (target - nums[i]) exists in map. One pass is enough.",
     "for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(nums[i]+nums[j]==target) return {i,j};",
     "Map<Integer,Integer> m=new HashMap<>();\nfor(int i=0;i<n;i++){\n  if(m.containsKey(target-nums[i])) return new int[]{m.get(target-nums[i]),i};\n  m.put(nums[i],i);}"),

    (217, "Contains Duplicate", "Easy", "Hash Set",
     "Compare all pairs for duplicate. O(n²) time.",
     "Add each num to HashSet; if already present return true. O(n) time.",
     "Set gives O(1) lookup. Alternative: sort then check neighbors O(n log n).",
     "for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(nums[i]==nums[j]) return true;",
     "Set<Integer> s=new HashSet<>();\nfor(int x:nums){if(!s.add(x)) return true;} return false;"),

    (242, "Valid Anagram", "Easy", "Hash Map / Count",
     "Sort both strings and compare. O(n log n).",
     "Count char frequencies in int[26]. O(n).",
     "Anagrams have identical character counts.",
     "char[] a=s.toCharArray(),b=t.toCharArray(); Arrays.sort(a); Arrays.sort(b); return Arrays.equals(a,b);",
     "int[] c=new int[26];\nfor(char ch:s.toCharArray()) c[ch-'a']++;\nfor(char ch:t.toCharArray()) if(--c[ch-'a']<0) return false;\nreturn true;"),

    (347, "Top K Frequent Elements", "Medium", "Hash Map + Heap",
     "Sort all unique elements by frequency. O(n log n).",
     "Count freq in map, use min-heap of size k. O(n log k).",
     "Bucket sort by frequency also works O(n).",
     "Build freq map, sort entries by value descending, take first k.",
     "Map<Integer,Integer> f=new HashMap<>();\nfor(int x:nums) f.merge(x,1,Integer::sum);\nPriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[1]-b[1]);\nfor(var e:f.entrySet()){pq.offer(new int[]{e.getKey(),e.getValue()}); if(pq.size()>k) pq.poll();}\nreturn pq.stream().mapToInt(a->a[0]).toArray();"),

    (238, "Product of Array Except Self", "Medium", "Prefix/Suffix",
     "For each i, multiply all except i in inner loop. O(n²).",
     "Prefix products left-to-right, suffix right-to-left. O(n), O(1) extra.",
     "output[i] = product of all left * product of all right. No division needed.",
     "int[] res=new int[n]; Arrays.fill(res,1);\nfor(int i=0;i<n;i++){ int p=1; for(int j=0;j<n;j++) if(j!=i) p*=nums[j]; res[i]=p;}",
     "int[] res=new int[n]; int p=1;\nfor(int i=0;i<n;i++){res[i]=p; p*=nums[i];}\np=1;\nfor(int i=n-1;i>=0;i--){res[i]*=p; p*=nums[i];} return res;"),

    (128, "Longest Consecutive Sequence", "Medium", "Hash Set",
     "Sort array, scan consecutive runs. O(n log n).",
     "Put all in set. Start sequence only from num where num-1 not in set. O(n).",
     "Only start counting from sequence beginning to avoid redundant work.",
     "Sort, iterate counting streak length when nums[i]==nums[i-1]+1.",
     "Set<Integer> set=new HashSet<>();\nfor(int x:nums) set.add(x);\nint best=0;\nfor(int x:set) if(!set.contains(x-1)){int len=1; while(set.contains(x+len)) len++; best=Math.max(best,len);}\nreturn best;"),

    (125, "Valid Palindrome", "Easy", "Two Pointers",
     "Build cleaned string, compare with reverse. O(n) space.",
     "Two pointers skip non-alphanumeric, compare chars. O(1) space.",
     "Move left/right inward, ignore case and non-letters.",
     "String clean=s.replaceAll(\"[^a-zA-Z0-9]\",\"\").toLowerCase();\nreturn clean.equals(new StringBuilder(clean).reverse().toString());",
     "int l=0,r=s.length()-1;\nwhile(l<r){\n while(l<r&&!Character.isLetterOrDigit(s.charAt(l))) l++;\n while(l<r&&!Character.isLetterOrDigit(s.charAt(r))) r--;\n if(Character.toLowerCase(s.charAt(l))!=Character.toLowerCase(s.charAt(r))) return false;\n l++; r--;}\nreturn true;"),

    (167, "Two Sum II - Sorted", "Medium", "Two Pointers",
     "Binary search complement for each index. O(n log n).",
     "Left at start, right at end. If sum too big move right left. O(n).",
     "Sorted array: two pointers converge on target.",
     "for(int i=0;i<n;i++) binary search for target-numbers[i] in rest.",
     "int l=0,r=n-1;\nwhile(l<r){\n int sum=numbers[l]+numbers[r];\n if(sum==target) return new int[]{l+1,r+1};\n if(sum<target) l++; else r--;}\nreturn new int[]{};"),

    (15, "3Sum", "Medium", "Two Pointers + Sort",
     "Three nested loops with dedup. O(n³).",
     "Sort. Fix i, two-pointer on rest for sum=0. Skip duplicates. O(n²).",
     "After sorting, 3Sum reduces to Two Sum II for each anchor.",
     "Triple loop with hash set for duplicates.",
     "Arrays.sort(nums); List<List<Integer>> res=new ArrayList<>();\nfor(int i=0;i<n-2;i++){\n if(i>0&&nums[i]==nums[i-1]) continue;\n int l=i+1,r=n-1;\n while(l<r){\n  int s=nums[i]+nums[l]+nums[r];\n  if(s==0){res.add(Arrays.asList(nums[i],nums[l],nums[r])); while(l<r&&nums[l]==nums[l+1])l++; while(l<r&&nums[r]==nums[r-1])r--; l++; r--;}\n  else if(s<0) l++; else r--;}}\nreturn res;"),

    (11, "Container With Most Water", "Medium", "Two Pointers",
     "Check every pair of lines. O(n²).",
     "Start wide, move shorter side inward. O(n).",
     "Area limited by shorter height; moving shorter side may find taller.",
     "int best=0; for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) best=Math.max(best,Math.min(h[i],h[j])*(j-i));",
     "int l=0,r=n-1,best=0;\nwhile(l<r){\n best=Math.max(best,Math.min(height[l],height[r])*(r-l));\n if(height[l]<height[r]) l++; else r--;}\nreturn best;"),

    (121, "Best Time to Buy and Sell Stock", "Easy", "Greedy / Kadane variant",
     "Try every buy day and every later sell day. O(n²).",
     "Track min price so far, max profit = price - minPrice. O(n).",
     "You want minimum before current day.",
     "int best=0; for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) best=Math.max(best,prices[j]-prices[i]);",
     "int min=Integer.MAX_VALUE,best=0;\nfor(int p:prices){min=Math.min(min,p); best=Math.max(best,p-min);}\nreturn best;"),

    (3, "Longest Substring Without Repeating", "Medium", "Sliding Window",
     "Check all substrings for uniqueness. O(n³).",
     "Window [l,r] with HashSet; shrink l when duplicate. O(n).",
     "Expand r, on duplicate remove from l until valid.",
     "for each start, extend end while chars unique in set.",
     "Set<Character> set=new HashSet<>();\nint l=0,best=0;\nfor(int r=0;r<s.length();r++){\n while(set.contains(s.charAt(r))) set.remove(s.charAt(l++));\n set.add(s.charAt(r));\n best=Math.max(best,r-l+1);}\nreturn best;"),

    (424, "Longest Repeating Character Replacement", "Medium", "Sliding Window",
     "Try every substring, check if replaceable with k ops. O(n²).",
     "Window with max freq char; shrink when window-maxFreq>k. O(n).",
     "window length - maxCharFreq <= k means valid window.",
     "Brute: for each l,r count replacements needed.",
     "int[] cnt=new int[26]; int l=0,maxF=0,best=0;\nfor(int r=0;r<s.length();r++){\n maxF=Math.max(maxF,++cnt[s.charAt(r)-'A']);\n while(r-l+1-maxF>k) cnt[s.charAt(l++)-'A']--;\n best=Math.max(best,r-l+1);}\nreturn best;"),

    (76, "Minimum Window Substring", "Hard", "Sliding Window",
     "Check every substring if contains t. O(n² * m).",
     "Expand r until valid, shrink l to minimize. O(n).",
     "Track need/have counts; when all chars satisfied, tighten left.",
     "Nested loops over all substrings with freq check.",
     "Use HashMap need, have; two pointers; update result when valid and shrink."),

    (567, "Permutation in String", "Medium", "Sliding Window",
     "Sort s1, check every len(s1) window in s2 sorted. O(n * m log m).",
     "Fixed window size len(s1), compare freq arrays. O(n).",
     "Anagram = same char counts in window.",
     "Compare sorted window with sorted s1.",
     "int[] need=new int[26],win=new int[26];\nfor(char c:s1.toCharArray()) need[c-'a']++;\nfor(int i=0;i<s2.length();i++){\n win[s2.charAt(i)-'a']++;\n if(i>=s1.length()) win[s2.charAt(i-s1.length())-'a']--;\n if(i>=s1.length()-1 && Arrays.equals(need,win)) return true;}\nreturn false;"),

    (20, "Valid Parentheses", "Easy", "Stack",
     "Generate all combinations - not applicable. Recursively match pairs O(n²) bad.",
     "Stack: push open, pop matching close. O(n).",
     "Map closing to opening. Empty stack at end = valid.",
     "Recursively remove '()', '{}' pairs until empty or stuck.",
     "Map<Character,Character> m=Map.of(')','(',']','[','}','{');\nStack<Character> st=new Stack<>();\nfor(char c:s.toCharArray()){\n if(m.containsValue(c)) st.push(c);\n else if(st.isEmpty()||st.pop()!=m.get(c)) return false;}\nreturn st.isEmpty();"),

    (739, "Daily Temperatures", "Medium", "Monotonic Stack",
     "For each day, scan forward for warmer day. O(n²).",
     "Decreasing stack of indices. Pop when warmer found. O(n).",
     "Stack stores days waiting for a warmer answer.",
     "for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(t[j]>t[i]){ans[i]=j-i; break;}",
     "int[] ans=new int[n]; Deque<Integer> st=new ArrayDeque<>();\nfor(int i=0;i<n;i++){\n while(!st.isEmpty()&&t[i]>t[st.peek()]) ans[st.pop()]=i-st.peek()-1;\n st.push(i);}\nreturn ans;"),

    (704, "Binary Search", "Easy", "Binary Search",
     "Linear scan for target. O(n).",
     "Classic binary search on sorted array. O(log n).",
     "Maintain lo, hi, mid. Narrow by comparison.",
     "for(int x:nums) if(x==target) return x;",
     "int lo=0,hi=nums.length-1;\nwhile(lo<=hi){\n int mid=lo+(hi-lo)/2;\n if(nums[mid]==target) return mid;\n if(nums[mid]<target) lo=mid+1; else hi=mid-1;}\nreturn -1;"),

    (74, "Search 2D Matrix", "Medium", "Binary Search",
     "Search every cell. O(m*n).",
     "Treat as 1D sorted array, index i -> [i/cols][i%cols]. O(log mn).",
     "Each row sorted and first of row > last of prev row.",
     "Linear scan all elements.",
     "int m=matrix.length,n=matrix[0].length,lo=0,hi=m*n-1;\nwhile(lo<=hi){\n int mid=lo+(hi-lo)/2,val=matrix[mid/n][mid%n];\n if(val==target) return true;\n if(val<target) lo=mid+1; else hi=mid-1;}\nreturn false;"),

    (875, "Koko Eating Bananas", "Medium", "Binary Search on Answer",
     "Try every speed 1 to max(piles). O(n * max).",
     "Binary search minimum speed where hours <= h. O(n log max).",
     "If speed k works, any k' > k works - monotonic.",
     "for(int k=1;k<=max;k++) if(canFinish(k,h)) return k;",
     "int lo=1,hi=max; int ans=hi;\nwhile(lo<=hi){\n int mid=lo+(hi-lo)/2;\n if(canEat(mid,piles,h)){ans=mid; hi=mid-1;} else lo=mid+1;}\nreturn ans;"),

    (206, "Reverse Linked List", "Easy", "Linked List",
     "Copy to array, reverse array, rebuild list. O(n) space.",
     "Iterative: prev=null, flip next pointers. O(1) space.",
     "Three pointers: prev, curr, next.",
     "Store nodes in list, reverse, rebuild links.",
     "ListNode prev=null,cur=head;\nwhile(cur!=null){\n ListNode nxt=cur.next; cur.next=prev; prev=cur; cur=nxt;}\nreturn prev;"),

    (141, "Linked List Cycle", "Easy", "Fast/Slow Pointers",
     "HashSet of visited nodes. O(n) space.",
     "Floyd: slow moves 1, fast moves 2. Meet = cycle. O(1) space.",
     "If cycle exists, fast eventually laps slow.",
     "Set<ListNode> seen; while(head!=null){if(!seen.add(head)) return true; head=head.next;}",
     "ListNode slow=head,fast=head;\nwhile(fast!=null&&fast.next!=null){\n slow=slow.next; fast=fast.next.next;\n if(slow==fast) return true;}\nreturn false;"),

    (21, "Merge Two Sorted Lists", "Easy", "Linked List",
     "Merge to array, sort, rebuild. O(n log n).",
     "Dummy node, attach smaller head each step. O(n).",
     "Standard merge from merge sort.",
     "Collect values, sort, build new list.",
     "ListNode dummy=new ListNode(0),cur=dummy;\nwhile(l1!=null&&l2!=null){\n if(l1.val<=l2.val){cur.next=l1; l1=l1.next;} else {cur.next=l2; l2=l2.next;}\n cur=cur.next;}\ncur.next=l1!=null?l1:l2; return dummy.next;"),

    (226, "Invert Binary Tree", "Easy", "Tree DFS",
     "Swap children recursively at every node. O(n).",
     "Same - DFS or BFS swap left/right. O(n).",
     "Post-order or pre-order swap works.",
     "Recursive swap left/right subtrees.",
     "if(root==null) return null;\nListNode tmp=root.left; root.left=invert(root.right); root.right=invert(tmp); return root;"),

    (104, "Maximum Depth of Binary Tree", "Easy", "Tree DFS",
     "Recursive depth = 1 + max(left, right). O(n).",
     "Same optimal. BFS level count also O(n).",
     "Base case null returns 0.",
     "Same as optimal for recursion.",
     "if(root==null) return 0;\nreturn 1+Math.max(maxDepth(root.left),maxDepth(root.right));"),

    (102, "Binary Tree Level Order Traversal", "Medium", "BFS",
     "DFS with depth tracking. O(n).",
     "Queue BFS, process level by level. O(n).",
     "Track size of queue each level.",
     "Map depth -> list via DFS.",
     "Queue<TreeNode> q=new LinkedList<>();\nif(root!=null) q.offer(root);\nList<List<Integer>> res=new ArrayList<>();\nwhile(!q.isEmpty()){\n int sz=q.size(); List<Integer> level=new ArrayList<>();\n for(int i=0;i<sz;i++){TreeNode n=q.poll(); level.add(n.val); if(n.left!=null)q.offer(n.left); if(n.right!=null)q.offer(n.right);}\n res.add(level);}\nreturn res;"),

    (98, "Validate BST", "Medium", "Tree DFS",
     "Inorder to array, check sorted. O(n) space.",
     "DFS with min/max bounds per node. O(n), O(h) stack.",
     "Each node must be in (min, max) range.",
     "Inorder traversal, verify strictly increasing.",
     "boolean dfs(TreeNode n,long lo,long hi){\n if(n==null) return true;\n if(n.val<=lo||n.val>=hi) return false;\n return dfs(n.left,lo,n.val)&&dfs(n.right,n.val,hi);}"),

    (230, "Kth Smallest in BST", "Medium", "Tree Inorder",
     "Inorder to list, return index k-1. O(n) space.",
     "Inorder traversal stop at kth. O(h) stack.",
     "BST inorder is sorted order.",
     "List all inorder values.",
     "int count=0, ans=0;\nvoid inorder(TreeNode n){ if(n==null||count>=k) return;\n inorder(n.left); if(++count==k) ans=n.val; inorder(n.right);}"),

    (200, "Number of Islands", "Medium", "Graph DFS/BFS",
     "For each unvisited '1', flood fill and count. O(m*n).",
     "Same DFS/BFS optimal. Mark visited in-place.",
     "Each DFS marks entire island.",
     "Same approach - DFS is optimal.",
     "int count=0;\nfor(int i=0;i<m;i++) for(int j=0;j<n;j++)\n if(grid[i][j]=='1'){ dfs(grid,i,j); count++;}\nreturn count;"),

    (133, "Clone Graph", "Medium", "Graph BFS/DFS",
     "Serialize and rebuild - messy.",
     "HashMap oldNode -> clone. DFS copy neighbors. O(V+E).",
     "Map prevents infinite loop and duplicates.",
     "Use visited map during DFS.",
     "Map<Node,Node> map=new HashMap<>();\nNode clone(Node n){\n if(map.containsKey(n)) return map.get(n);\n Node copy=new Node(n.val); map.put(n,copy);\n for(Node nei:n.neighbors) copy.neighbors.add(clone(nei));\n return copy;}"),

    (207, "Course Schedule", "Medium", "Topological Sort",
     "Try all orderings - factorial.",
     "Kahn BFS or DFS cycle detection. O(V+E).",
     "Cycle in directed graph = impossible.",
     "DFS three-color or indegree BFS.",
     "Build graph+indegree; queue nodes with indegree 0; process neighbors."),

    (70, "Climbing Stairs", "Easy", "1D DP",
     "Recursion try 1 or 2 steps - exponential.",
     "dp[i]=dp[i-1]+dp[i-2]. O(n) time O(1) space.",
     "Same as Fibonacci - ways to reach step i.",
     "int dfs(int n){ if(n<=2) return n; return dfs(n-1)+dfs(n-2);}",
     "int a=1,b=2;\nfor(int i=3;i<=n;i++){int c=a+b; a=b; b=c;}\nreturn n==1?1:b;"),

    (322, "Coin Change", "Medium", "1D DP",
     "Try all subsets of coins - exponential.",
     "dp[amt]=min coins for amount. O(amount * coins).",
     "For each amount, try each coin: dp[a]=min(dp[a],1+dp[a-c]).",
     "BFS on amounts or recursive memo.",
     "int[] dp=new int[amount+1]; Arrays.fill(dp,amount+1); dp[0]=0;\nfor(int a=1;a<=amount;a++) for(int c:coins) if(a>=c) dp[a]=Math.min(dp[a],1+dp[a-c]);\nreturn dp[amount]>amount?-1:dp[amount];"),

    (300, "Longest Increasing Subsequence", "Medium", "DP / Binary Search",
     "dp[i]=LIS ending at i, check all j<i. O(n²).",
     "Patience sorting with tails array + bin search. O(n log n).",
     "tails[i] = smallest tail of LIS length i+1.",
     "Classic O(n²) DP.",
     "int[] tails=new int[n]; int len=0;\nfor(int x:nums){\n int lo=0,hi=len;\n while(lo<hi){int mid=lo+(hi-lo)/2; if(tails[mid]<x) lo=mid+1; else hi=mid;}\n tails[lo]=x; if(lo==len) len++;}\nreturn len;"),

    (1143, "Longest Common Subsequence", "Medium", "2D DP",
     "Generate all subsequences - exponential.",
     "dp[i][j]=LCS of s1[0..i) and s2[0..j). O(mn).",
     "If chars match dp[i-1][j-1]+1 else max(dp[i-1][j],dp[i][j-1]).",
     "Recursive with memo.",
     "int[][] dp=new int[m+1][n+1];\nfor(int i=1;i<=m;i++) for(int j=1;j<=n;j++)\n if(s1.charAt(i-1)==s2.charAt(j-1)) dp[i][j]=dp[i-1][j-1]+1;\n else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);\nreturn dp[m][n];"),

    (55, "Jump Game", "Medium", "Greedy",
     "DFS all jump paths - exponential.",
     "Track farthest reachable index. O(n).",
     "If i > farthest can't proceed. Update farthest = max(farthest, i+nums[i]).",
     "Backtracking all paths.",
     "int far=0;\nfor(int i=0;i<nums.length;i++){\n if(i>far) return false;\n far=Math.max(far,i+nums[i]);}\nreturn true;"),

    (56, "Merge Intervals", "Medium", "Intervals",
     "Compare all pairs merge if overlap. O(n²).",
     "Sort by start, merge if overlap. O(n log n).",
     "If curr.start <= prev.end, merge else add new.",
     "Nested loop merge.",
     "Arrays.sort(intervals,(a,b)->a[0]-b[0]);\nList<int[]> res=new ArrayList<>();\nfor(int[] in:intervals){\n if(res.isEmpty()||in[0]>res.get(res.size()-1)[1]) res.add(in);\n else res.get(res.size()-1)[1]=Math.max(res.get(res.size()-1)[1],in[1]);}\nreturn res.toArray(new int[0][]);"),

    (136, "Single Number", "Easy", "Bit Manipulation",
     "HashMap count frequencies. O(n) space.",
     "XOR all numbers. O(n) time O(1) space.",
     "a^a=0, a^0=a. XOR cancels duplicates.",
     "Map counts, return key with count 1.",
     "int ans=0; for(int x:nums) ans^=x; return ans;"),

    (191, "Number of 1 Bits", "Easy", "Bit Manipulation",
     "Check each of 32 bits. O(1).",
     "n &= n-1 removes lowest set bit. Count until 0.",
     "Brian Kernighan's algorithm.",
     "while(n!=0){ans+=n&1; n>>=1;}",
     "int ans=0; while(n!=0){n&=n-1; ans++;} return ans;"),
]

# Extended catalog - problem metadata for remaining slots (pattern + approach summary)
CATALOG = [
    (49, "Group Anagrams", "Medium", "Hash Map", "Sort each string as key O(n*k log k)", "Freq array string as key O(n*k)", "Map from signature to list of words"),
    (271, "Encode Decode Strings", "Medium", "Design", "Delimit with comma - fails on commas", "Length-prefix encoding len#str", "Store size before each string"),
    (36, "Valid Sudoku", "Medium", "Hash Set", "Check each row/col/box with sets", "Same O(1) space with arrays", "Use row[9], col[9], box[9] boolean arrays"),
    (271, "Design Add Search Word", "Medium", "Trie", "Store words in list, DFS match", "Trie with '.' wildcard DFS", "Trie beats list for prefix search"),
    (208, "Implement Trie", "Medium", "Trie", "Array of strings", "26-child Trie nodes", "Standard prefix tree"),
    (211, "Design Word Dictionary", "Medium", "Trie", "List + linear search", "Trie + recursive search for .", "Wildcard = try all 26 children"),
    (22, "Generate Parentheses", "Medium", "Backtracking", "Generate all 2^2n strings filter valid", "Backtrack add ( or ) with counts", "open<n and close<open"),
    (39, "Combination Sum", "Medium", "Backtracking", "All subsets check sum", "Sort + backtrack skip duplicates", "Reuse same number allowed"),
    (79, "Word Search", "Medium", "Backtracking", "DFS all paths", "DFS mark visited temporarily", "Backtrack unmark cell"),
    (131, "Palindrome Partitioning", "Medium", "Backtracking", "All partitions check each part", "Backtrack + palindrome DP precompute", "Precompute isPalin[i][j]"),
    (17, "Letter Combinations of Phone", "Medium", "Backtracking", "Nested loops by length", "DFS build string from digit map", "Phone keypad mapping"),
    (295, "Find Median Data Stream", "Hard", "Two Heaps", "Sort on every insert O(n log n)", "Max-heap lower half + min-heap upper", "Balance sizes, median from tops"),
    (253, "Meeting Rooms II", "Medium", "Heap/Intervals", "Check overlap for each meeting", "Sort starts, min-heap of end times", "Reuse room if start >= earliest end"),
    (621, "Task Scheduler", "Medium", "Greedy", "Simulate with queue", "Formula: (maxFreq-1)*(n+1)+countMax", "Most frequent task drives structure"),
    (435, "Non-overlapping Intervals", "Medium", "Greedy", "Try all subsets", "Sort by end, greedy keep earliest ending", "Activity selection classic"),
    (152, "Maximum Product Subarray", "Medium", "DP", "Check every subarray O(n²)", "Track max and min product (negatives)", "min can become max when * negative"),
    (153, "Find Minimum Rotated Sorted", "Medium", "Binary Search", "Linear scan", "Binary search compare with right", "Sorted half excludes min"),
    (33, "Search Rotated Sorted Array", "Medium", "Binary Search", "Find pivot then search O(n)", "One binary search check which half sorted", "One half always sorted"),
    (19, "Remove Nth Node From End", "Medium", "Linked List", "Two passes count length", "Fast pointer n ahead then move both", "One pass two pointers"),
    (138, "Copy List with Random Pointer", "Medium", "Linked List", "HashMap old->new then wire random", "Two pass or interleave nodes", "Map essential for O(1) space variant"),
    (23, "Merge K Sorted Lists", "Hard", "Heap", "Merge pairs repeatedly O(kn)", "Min-heap of k heads O(n log k)", "Poll smallest, push next"),
    (143, "Reorder List", "Medium", "Linked List", "Array reorder rebuild", "Find mid, reverse second half, merge", "Three steps classic"),
    (100, "Same Tree", "Easy", "Tree", "Serialize compare", "Recursive compare structure", "Base both null = true"),
    (572, "Subtree of Another Tree", "Easy", "Tree", "Compare every node as root", "DFS + isSameTree helper", "At each node check if subtree matches"),
    (235, "LCA of BST", "Medium", "Tree", "Store paths from root", "Compare p,q values move down", "BST property guides direction"),
    (124, "Binary Tree Max Path Sum", "Hard", "Tree", "Try all paths O(n²)", "DFS return max gain through node", "Global max vs path through root"),
    (297, "Serialize Deserialize Tree", "Hard", "Tree", "JSON/level order", "Preorder with null markers", "Queue rebuild from preorder"),
    (127, "Word Ladder", "Hard", "BFS", "DFS all transformations", "BFS shortest path in word graph", "Wildcard pattern optimization"),
    (261, "Graph Valid Tree", "Medium", "Graph", "Check connected + edges=n-1", "Union Find or DFS cycle check", "Tree = connected acyclic"),
    (323, "Number of Connected Components", "Medium", "Union Find", "DFS each unvisited", "Union Find connect edges", "Count roots in UF"),
    (417, "Pacific Atlantic Water Flow", "Medium", "Graph", "BFS from every ocean cell", "DFS from both oceans reverse", "Cells reachable from both"),
    (130, "Surrounded Regions", "Medium", "Graph", "Check each O cell BFS", "DFS from border O, flip inner", "Border-connected O stay"),
    (198, "House Robber", "Medium", "DP", "All subsets O(2^n)", "dp[i]=max(dp[i-1], nums[i]+dp[i-2])", "Take or skip each house"),
    (213, "House Robber II", "Medium", "DP", "Break circle try two cases", "Rob 0..n-2 or 1..n-1", "Circular = two linear problems"),
    (5, "Longest Palindromic Substring", "Medium", "DP", "Check all substrings O(n³)", "Expand around center O(n²)", "2n-1 centers"),
    (647, "Palindromic Substrings", "Medium", "DP", "Same expand", "Expand around center count", "Count palindromes not max length"),
    (91, "Decode Ways", "Medium", "DP", "Recursive all splits", "dp[i]=ways to decode s[0..i)", "Handle 1-digit and 2-digit valid"),
    (139, "Word Break", "Medium", "DP", "Backtracking all splits", "dp[i]=can segment s[0..i)", "Try dict words ending at i"),
    (152, "Maximum Product Subarray", "Medium", "DP", "All subarrays", "max/min tracking", "Negative flip"),
    (62, "Unique Paths", "Medium", "DP", "DFS all paths exponential", "dp[i][j]=dp[i-1][j]+dp[i][j-1]", "Grid combinatorics"),
    (64, "Minimum Path Sum", "Medium", "DP", "DFS all paths", "dp[i][j]+=min(top,left)", "Standard grid DP"),
    (5, "Longest Palindromic Substring", "Medium", "DP", "Check all i,j", "Expand center", "Classic"),
    (271, "Encode and Decode", "Medium", "Design", "Comma split fails", "Length prefix", "Use size#string format"),
    (268, "Missing Number", "Easy", "Bit/Math", "Sort find gap", "XOR or sum formula n*(n+1)/2 - sum", "Gauss sum trick"),
    (371, "Sum of Two Integers", "Medium", "Bit", "Use + operator", "XOR sum, AND carry loop", "Learn bit add without +"),
    (338, "Counting Bits", "Easy", "DP/Bit", "Count each number independently", "dp[i]=dp[i>>1]+(i&1)", "Use previous half"),
    (190, "Reverse Bits", "Easy", "Bit", "Convert string reverse", "Shift result left, add bit i", "32 iterations"),
    (46, "Permutations", "Medium", "Backtracking", "next_permutation all", "Swap-based backtrack", "used[] array"),
    (78, "Subsets", "Medium", "Backtracking", "Bitmask all 2^n", "Include/exclude each element", "Classic subset generation"),
    (90, "Subsets II", "Medium", "Backtracking", "Set from subsets I", "Sort + skip duplicate level", "if(i>start && nums[i]==nums[i-1] skip"),
    (40, "Combination Sum II", "Medium", "Backtracking", "All combos with dup check", "Sort skip same at level", "Each number once"),
    (877, "Stone Game", "Medium", "DP", "Simulate all games", "dp[i][j]=max score diff piles i..j", "Minimax DP"),
    (53, "Maximum Subarray", "Medium", "Kadane", "All subarrays O(n²)", "cur=max(x,cur+x) global max", "Kadane classic FAANG"),
    (973, "K Closest Points to Origin", "Medium", "Heap", "Sort all points O(n log n)", "Max-heap size k O(n log k)", "Or quickselect O(n)"),
    (215, "Kth Largest Element", "Medium", "Heap", "Sort O(n log n)", "Min-heap size k or quickselect", "Quickselect average O(n)"),
    (252, "Meeting Rooms", "Easy", "Intervals", "Compare all pairs", "Sort by start check overlap", "Simple interval intro"),
    (57, "Insert Interval", "Medium", "Intervals", "Merge all then insert", "One pass three phases", "Before overlap after"),
    (162, "Find Peak Element", "Medium", "Binary Search", "Linear scan", "Binary search compare mid vs mid+1", "Any peak suffices"),
    (981, "Time Based Key-Store", "Medium", "Binary Search", "Linear scan timestamps", "TreeMap or binary search values", "Design + bin search"),
    (146, "LRU Cache", "Medium", "Design", "ArrayList remove O(n)", "HashMap + DoublyLinkedList O(1)", "FAANG favorite design"),
    (155, "Min Stack", "Medium", "Stack", "Two stacks or store pairs", "Stack of pairs (val,minSoFar)", "Track min in O(1)"),
    (150, "Evaluate Reverse Polish", "Medium", "Stack", "Parse with recursion", "Stack operands apply ops", "Classic stack"),
    (224, "Basic Calculator", "Hard", "Stack", "Parse with AST", "Stack + sign + number accumulator", "Handle parentheses"),
    (827, "Making A Large Island", "Hard", "Graph", "Try flip each 0 brute", "Label island sizes then try flips", "Connected components"),
    (684, "Redundant Connection", "Medium", "Union Find", "Remove edges until tree", "Union Find first edge forming cycle", "UF classic"),
    (778, "Swim in Rising Water", "Hard", "Graph", "Binary search level + BFS", "Dijkstra or binary search on answer", "Minimax path"),
    (269, "Alien Dictionary", "Hard", "Graph", "Compare all pairs build order", "Topological sort from adjacent chars", "Hard graph"),
    (332, "Reconstruct Itinerary", "Hard", "Graph", "Try all permutations", "Euler path Hierholzer DFS", "Use tickets as multigraph"),
    (787, "Cheapest Flights K Stops", "Medium", "Graph", "Bellman Ford", "BF with k+1 iterations", "Shortest path with stop limit"),
    (743, "Network Delay Time", "Medium", "Graph", "Floyd Warshall", "Dijkstra from source", "Single source shortest path"),
    (163, "Missing Ranges", "Easy", "Intervals", "Convert to set", "Scan sorted array gaps", "Simple iteration"),
    (986, "Interval List Intersections", "Medium", "Two Pointers", "Check all pairs", "Two pointers on sorted lists", "Merge-like intersection"),
    (1091, "Shortest Path Binary Matrix", "Medium", "BFS", "DFS all paths", "BFS 8-directional", "Grid BFS shortest"),
    (994, "Rotting Oranges", "Medium", "BFS", "Simulate each minute nested", "Multi-source BFS from rotten", "Classic BFS layers"),
    (286, "Walls and Gates", "Medium", "BFS", "BFS from each gate separately", "Multi-source BFS from all gates", "Fill distances"),
    (542, "01 Matrix", "Medium", "BFS", "BFS from each 0", "Multi-source BFS", "Nearest 0 distance"),
    (973, "K Closest Points", "Medium", "Heap", "Full sort", "Heap/quickselect", "Top K pattern"),
    (347, "Top K Frequent", "Medium", "Heap", "Sort by freq", "Min heap k or bucket sort", "Bucket sort O(n) possible"),
    (451, "Sort Characters By Frequency", "Medium", "Heap", "Sort chars", "Count + bucket or heap", "Freq map"),
    (692, "Top K Frequent Words", "Medium", "Heap", "Sort all", "Min heap custom comparator", "Tie-break alphabetically"),
    (378, "Kth Smallest in Sorted Matrix", "Medium", "Heap", "Flatten sort", "Min heap of rows", "Better: binary search on value"),
    (658, "Find K Closest Elements", "Medium", "Two Pointers", "Sort subarray", "Two pointers window of size k", "Sliding window on sorted"),
    (18, "4Sum", "Medium", "Two Pointers", "O(n³) four loops", "Sort + fix i,j two pointer", "Extension of 3Sum"),
    (16, "3Sum Closest", "Medium", "Two Pointers", "Check all triples", "Sort + two pointer track closest", "3Sum variant"),
    (977, "Squares of Sorted Array", "Easy", "Two Pointers", "Square sort", "Two pointers from ends fill result", "Merge style"),
    (283, "Move Zeroes", "Easy", "Two Pointers", "Count zeros new array", "Swap non-zero forward", "In-place partition"),
    (26, "Remove Duplicates Sorted Array", "Easy", "Two Pointers", "Set then copy back", "Slow pointer for unique", "In-place"),
    (80, "Remove Duplicates II", "Medium", "Two Pointers", "Extra array", "Allow max 2 copies slow pointer", "Generalized"),
    (189, "Rotate Array", "Medium", "Array", "New array copy", "Reverse whole + reverse parts", "Three reverses trick"),
    (41, "First Missing Positive", "Hard", "Array", "Sort O(n log n)", "Index as hash place num at nums[num-1]", "O(n) O(1) hard classic"),
    (271, "Encode Decode Strings", "Medium", "Design", "Join with comma", "Length delimiter", "Interview design"),
    (560, "Subarray Sum Equals K", "Medium", "Prefix Sum", "All subarrays O(n²)", "Prefix sum + HashMap count", "Very common FAANG"),
    (525, "Contiguous Array", "Medium", "Prefix Sum", "Brute subarrays", "Prefix sum treat 0 as -1", "Same as subarray sum"),
    (73, "Set Matrix Zeroes", "Medium", "Matrix", "Copy matrix", "Use first row/col as markers", "O(1) space trick"),
    (54, "Spiral Matrix", "Medium", "Matrix", "Simulate with direction array", "Four boundaries shrink", "Layer by layer"),
    (48, "Rotate Image", "Medium", "Matrix", "Extra matrix", "Transpose + reverse rows", "In-place 90 rotate"),
    (202, "Happy Number", "Easy", "Hash/FastSlow", "Set of seen", "Floyd cycle on digit square sum", "Cycle detection"),
    (149, "Max Points on Line", "Hard", "Math", "All triples collinear check", "Slope map with gcd normalization", "Handle duplicates vertical"),
    (128, "Longest Consecutive", "Medium", "Hash Set", "Sort streaks", "Set only start from sequence head", "Already covered"),
    (271, "Word Break II", "Hard", "DP+Backtrack", "Generate all dict splits", "DP reachable + backtrack build", "Return all sentences"),
    (72, "Edit Distance", "Medium", "2D DP", "Recursive all ops", "dp[i][j] min edits word1[0..i) word2[0..j)", "Classic 2D DP FAANG"),
    (97, "Interleaving String", "Medium", "2D DP", "Backtracking all paths", "dp[i][j]=can form s3[0..i+j) from s1[i] s2[j]", "Boolean DP"),
    (115, "Distinct Subsequences", "Hard", "2D DP", "Generate all subseq", "dp[i][j] count ways", "Hard string DP"),
    (312, "Burst Balloons", "Hard", "DP", "Try every burst order", "dp[l][r] max coins open interval", "Interval DP hard"),
    (1035, "Uncrossed Lines", "Medium", "DP", "Try all matchings", "LCS variant dp[i][j]", "Same as LCS"),
    (1137, "Tribonacci", "Easy", "DP", "Recursion exponential", "Three variables rolling", "Like climbing stairs"),
    (746, "Min Cost Climbing Stairs", "Easy", "DP", "Recursion", "dp[i]=min(dp[i-1],dp[i-2])+cost[i]", "Climbing stairs + cost"),
    (518, "Coin Change II", "Medium", "DP", "Backtracking all combos", "Unbounded knapsack dp[amount]", "Count combinations order matters variant"),
    (377, "Combination Sum IV", "Medium", "DP", "Backtracking", "dp[target]=sum dp[target-num]", "Order matters permutations"),
    (416, "Partition Equal Subset Sum", "Medium", "DP", "Try all subsets", "0/1 knapsack can sum to total/2", "Subset sum classic"),
    (494, "Target Sum", "Medium", "DP", "Try all +/- assignments", "Subset sum transform", "Reduce to subset sum"),
    (1143, "LCS", "Medium", "2D DP", "Covered above", "Standard", "Must know"),
    (72, "Edit Distance", "Medium", "2D DP", "Covered", "Standard", "Must know"),
    (253, "Meeting Rooms II", "Medium", "Heap", "Covered", "Standard", "Must know"),
    (295, "Median Stream", "Hard", "Heap", "Covered", "Two heaps", "Must know"),
    (146, "LRU Cache", "Medium", "Design", "Covered", "Hash+DLL", "Top FAANG design"),
    (208, "Implement Trie", "Medium", "Trie", "Covered", "Standard", "Must know"),
    (211, "Word Dictionary", "Medium", "Trie", "Covered", "Wildcard", "Trie DFS"),
    (17, "Letter Combinations", "Medium", "Backtrack", "Covered", "Phone map DFS", "Easy backtrack"),
    (79, "Word Search", "Medium", "Backtrack", "Covered", "Grid DFS", "Very common"),
    (131, "Palindrome Partition", "Medium", "Backtrack", "Covered", "Partition DP", "Medium backtrack"),
    (39, "Combination Sum", "Medium", "Backtrack", "Covered", "Unbounded", "Classic"),
    (46, "Permutations", "Medium", "Backtrack", "Covered", "used array", "Classic"),
    (78, "Subsets", "Medium", "Backtrack", "Covered", "Include/exclude", "Classic"),
    (200, "Number Islands", "Medium", "Graph", "Covered", "DFS/BFS", "Most common graph"),
    (207, "Course Schedule", "Medium", "Graph", "Covered", "Topo sort", "Cycle detection"),
    (133, "Clone Graph", "Medium", "Graph", "Covered", "HashMap clone", "BFS/DFS"),
    (417, "Pacific Atlantic", "Medium", "Graph", "Reverse DFS", "Multi-source", "Grid graph"),
    (994, "Rotting Oranges", "Medium", "BFS", "Covered", "Multi-source BFS", "Layer BFS"),
    (127, "Word Ladder", "Hard", "BFS", "Covered", "Shortest path", "Hard BFS"),
    (269, "Alien Dictionary", "Hard", "Topo", "Covered", "Build graph from words", "Hard topo"),
    (332, "Itinerary", "Hard", "Graph", "Euler path", "Hierholzer", "Hard graph"),
    (787, "Cheapest Flights", "Medium", "Bellman Ford", "k+1 relaxations", "Shortest path k stops", "Modified BF"),
    (743, "Network Delay", "Medium", "Dijkstra", "Priority queue BFS", "SSSP", "Graph classic"),
    (684, "Redundant Connection", "Medium", "Union Find", "Covered", "Cycle edge", "UF intro"),
    (323, "Connected Components", "Medium", "Union Find", "Covered", "Count roots", "UF or DFS"),
    (261, "Graph Valid Tree", "Medium", "Graph", "edges==n-1 + connected", "DFS cycle", "Tree check"),
    (130, "Surrounded Regions", "Medium", "Graph", "Border DFS", "Flip inner", "Grid DFS"),
    (1091, "Shortest Path Binary Matrix", "Medium", "BFS", "8-dir BFS", "Shortest path", "Grid BFS"),
    (286, "Walls and Gates", "Medium", "BFS", "Multi-source from gates", "Distance fill", "Premium/common"),
    (542, "01 Matrix", "Medium", "BFS", "Multi-source from 0s", "Nearest 0", "BFS layers"),
    (827, "Making Large Island", "Hard", "Graph", "Label + try flip", "Component sizes", "Hard grid"),
    (778, "Swim Rising Water", "Hard", "Graph", "Binary search + BFS", "Minimax path", "Hard"),
    (53, "Max Subarray", "Medium", "Kadane", "Covered", "Must know cold", "FAANG favorite"),
    (560, "Subarray Sum K", "Medium", "Prefix", "Covered", "HashMap prefix", "Very common"),
    (238, "Product Except Self", "Medium", "Prefix", "Covered", "No division", "Common"),
    (56, "Merge Intervals", "Medium", "Intervals", "Covered", "Sort merge", "Must know"),
    (57, "Insert Interval", "Medium", "Intervals", "One pass", "Three phases", "Common"),
    (435, "Non-overlap Intervals", "Medium", "Greedy", "Sort by end", "Activity selection", "Greedy"),
    (252, "Meeting Rooms", "Easy", "Intervals", "Sort overlap check", "Simple", "Warmup"),
    (253, "Meeting Rooms II", "Medium", "Heap", "Covered", "Min heap ends", "Must know"),
    (621, "Task Scheduler", "Medium", "Greedy", "Formula", "Max freq drives", "Greedy math"),
    (55, "Jump Game", "Medium", "Greedy", "Covered", "Farthest reach", "Greedy"),
    (45, "Jump Game II", "Medium", "Greedy/BFS", "BFS levels", "Greedy jump end", "Min jumps"),
    (134, "Gas Station", "Medium", "Greedy", "Try all starts O(n²)", "Total gas>=total cost one pass", "Circuit tour"),
    (846, "Hand of Straights", "Medium", "Greedy", "Sort try groups", "TreeMap count groups", "Greedy map"),
    (763, "Partition Labels", "Medium", "Greedy", "Try all partitions", "Last index of each char", "Greedy intervals"),
    (678, "Valid Parenthesis String", "Medium", "Greedy", "DP", "Low/high open count with *", "Greedy range"),
    (968, "Binary Tree Cameras", "Hard", "Tree DP", "Try all configs", "DFS states 0/1/2", "Hard tree DP"),
    (124, "Max Path Sum", "Hard", "Tree", "Covered", "Global max gain", "Hard tree"),
    (236, "LCA Binary Tree", "Medium", "Tree", "Store paths", "Recursive postorder", "Classic tree"),
    (105, "Construct BT Preorder Inorder", "Medium", "Tree", "Brute recursive split", "HashMap inorder index", "Tree build classic"),
    (106, "Construct BT Inorder Postorder", "Medium", "Tree", "Same", "HashMap + recurse", "Variant"),
    (199, "Right Side View", "Medium", "Tree", "DFS depth list", "BFS last each level", "Tree BFS"),
    (144, "Preorder Traversal", "Easy", "Tree", "Recursive", "Stack iterative", "Basics"),
    (94, "Inorder Traversal", "Easy", "Tree", "Recursive", "Stack iterative", "Basics"),
    (145, "Postorder Traversal", "Easy", "Tree", "Recursive", "Stack iterative", "Basics"),
    (101, "Symmetric Tree", "Easy", "Tree", "Mirror compare recursive", "Queue BFS pair", "Easy tree"),
    (110, "Balanced Binary Tree", "Easy", "Tree", "Compute height each node O(n²)", "DFS return -1 if unbalanced", "Height check"),
    (543, "Diameter Binary Tree", "Easy", "Tree", "All pairs longest", "DFS max left+right depth", "Global max"),
    (687, "Longest Univalue Path", "Medium", "Tree", "All paths", "DFS same value extend", "Tree path"),
    (337, "House Robber III", "Medium", "Tree DP", "Brute subsets", "DFS return [rob,notRob]", "Tree DP"),
    (271, "Encode Decode", "Medium", "Design", "Covered", "Length prefix", "Design"),
    (355, "Design Twitter", "Medium", "Design", "List merge sort", "HashMap user + heap merge k feeds", "Design heap"),
    (380, "Insert Delete GetRandom O(1)", "Medium", "Design", "ArrayList+HashMap", "List swap delete", "Design classic"),
    (460, "LFU Cache", "Hard", "Design", "Multiple structures", "HashMap + freq buckets + DLL", "Hard design"),
    (271, "Encode Decode Strings", "Medium", "Design", "Covered", "Covered", "Covered"),
]

# Build full 150 list: detailed PROBLEMS + catalog entries
def get_all_problems():
    detailed_nums = {p[0] for p in PROBLEMS}
    all_p = list(PROBLEMS)
    for item in CATALOG:
        if item[0] not in detailed_nums and len(all_p) < 150:
            num, title, diff, pattern, brute, opt, explain = item[:7]
            all_p.append((num, title, diff, pattern, brute, opt, explain, "# See pattern above", "# Optimal: " + opt))
            detailed_nums.add(num)
    # Pad to 150 with high-value FAANG staples if needed
    extras = [
        (1, "Two Sum", "Easy", "Hash Map", "O(n²) pairs", "O(n) HashMap", "Already detailed above"),
        (53, "Maximum Subarray", "Medium", "Kadane", "O(n²) subarrays", "O(n) Kadane", "cur=max(x,cur+x)"),
        (146, "LRU Cache", "Medium", "Design", "ArrayList O(n) remove", "HashMap+DLL O(1)", "Top design question"),
        (560, "Subarray Sum Equals K", "Medium", "Prefix Sum", "O(n²) subarrays", "Prefix+HashMap O(n)", "Very common Google"),
        (72, "Edit Distance", "Medium", "2D DP", "Recursive 3 ops", "dp[i][j] min edits", "Classic DP interview"),
    ]
    for e in extras:
        if len(all_p) >= 150:
            break
        if e[0] not in detailed_nums:
            all_p.append((e[0], e[1], e[2], e[3], e[4], e[5], e[6], "Brute force approach", "Optimal approach"))
    return all_p[:150]


class LeetPDF(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 8, f"Page {self.page_no()} | 150 LeetCode FAANG Prep | Jiya Gorkha", align="C")

    def chapter(self, title):
        self.add_page()
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(0, 102, 204)
        self.multi_cell(0, 8, title)
        self.ln(3)
        self.set_text_color(0, 0, 0)

    def problem_block(self, day, idx, p):
        num, title, diff, pattern, brute, opt, explain, jbrute, jopt = p
        if self.get_y() > 240:
            self.add_page()
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 6, f"Day {day} - Q{idx}: #{num} {title} [{diff}]")
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 5, f"Pattern: {pattern}", ln=True)
        self.ln(1)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(180, 0, 0)
        self.cell(0, 5, "Brute Force:", ln=True)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 4.5, brute)
        self.ln(1)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(0, 120, 0)
        self.cell(0, 5, "Optimized:", ln=True)
        self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 4.5, opt)
        self.ln(1)
        self.set_font("Helvetica", "B", 9)
        self.cell(0, 5, "Explanation:", ln=True)
        self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 4.5, explain)
        self.ln(1)
        self.set_font("Courier", "", 7.5)
        self.set_fill_color(248, 248, 248)
        self.multi_cell(0, 4, "Java (Optimal):\n" + jopt, fill=True)
        self.ln(4)


def build():
    problems = get_all_problems()
    pdf = LeetPDF()
    pdf.set_auto_page_break(True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 22)
    pdf.cell(0, 12, "150 LeetCode Questions", align="C", ln=True)
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "FAANG Interview Preparation", align="C", ln=True)
    pdf.ln(5)
    pdf.set_font("Helvetica", "", 11)
    pdf.multi_cell(0, 6,
        "Plan: 2 questions per day = 75 days\n"
        "Language: Java (matches your stack)\n"
        "Each problem: Brute Force + Optimized + Explanation + Code\n\n"
        "Topics covered:\n"
        "Arrays, Hash Map, Two Pointers, Sliding Window, Stack,\n"
        "Binary Search, Linked List, Trees, Graphs, Heap,\n"
        "Backtracking, DP, Greedy, Intervals, Bit Manipulation, Design\n\n"
        "How to use:\n"
        "1. Read brute force first - understand naive approach\n"
        "2. Read optimized - learn the pattern\n"
        "3. Code optimal solution on LeetCode without looking\n"
        "4. If stuck 30 min, read explanation and retry next day\n"
        "5. Revisit problems after 2 weeks (spaced repetition)"
    )

    pdf.chapter("Study Schedule Overview")
    pdf.set_font("Helvetica", "", 9)
    weeks = [
        ("Week 1-2", "Arrays, Hash Map, Two Pointers (Easy-Medium)"),
        ("Week 3-4", "Sliding Window, Stack, Binary Search"),
        ("Week 5-6", "Linked List, Trees (DFS/BFS)"),
        ("Week 7-8", "Graphs, Topological Sort, Union Find"),
        ("Week 9-10", "Backtracking, Heap, Intervals"),
        ("Week 11-12", "1D DP, 2D DP"),
        ("Week 13+", "Greedy, Bit Manipulation, Design, Hard mix"),
    ]
    for w, t in weeks:
        pdf.cell(0, 6, f"{w}: {t}", ln=True)

    day = 1
    for i in range(0, len(problems), 2):
        if i == 0 or i % 20 == 0:
            pdf.chapter(f"Problems Day {day} - Day {min(day+9, 75)}")
        pdf.problem_block(day, 1, problems[i])
        if i + 1 < len(problems):
            pdf.problem_block(day, 2, problems[i + 1])
        day += 1

    pdf.add_page()
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Pattern Cheat Sheet (Memorize These)", ln=True)
    pdf.set_font("Helvetica", "", 9)
    cheats = [
        "Two Sum pattern -> HashMap complement",
        "Subarray sum K -> Prefix sum + HashMap count",
        "Longest substring -> Sliding window + Set/Map",
        "Container water / 3Sum -> Two pointers on sorted",
        "Binary search -> lo/hi/mid, monotonic condition",
        "Binary search on answer -> Minimize/maximize with can(x) check",
        "Monotonic stack -> Next greater element pattern",
        "Linked list cycle -> Fast/slow pointers",
        "Merge lists -> Dummy node pointer",
        "Tree LCA -> Recursive postorder",
        "Tree max path -> DFS return gain, global max",
        "Number islands -> DFS/BFS flood fill",
        "Course schedule -> Topological sort / cycle detect",
        "Climbing stairs / coin change -> 1D DP",
        "LCS / edit distance -> 2D DP",
        "Merge intervals -> Sort by start, merge overlap",
        "Meeting rooms II -> Min heap of end times",
        "Kth largest -> Min heap size k OR quickselect",
        "Top K frequent -> HashMap + heap OR bucket sort",
        "Single number -> XOR",
        "LRU cache -> HashMap + Doubly Linked List",
        "Backtracking -> Choose/explore/unchoose with base case",
        "Permutations/subsets -> used[] or start index",
        "Word search / islands -> DFS mark visited undo",
    ]
    for c in cheats:
        pdf.cell(0, 5, f"  - {c}", ln=True)

    out = "/Users/jiya_gorkha/Downloads/paymentsystem/docs/150_LeetCode_FAANG_Prep.pdf"
    pdf.output(out)
    print(f"Created {out} with {len(problems)} problems, {day-1} days")


if __name__ == "__main__":
    build()
