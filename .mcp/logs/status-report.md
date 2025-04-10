
                                                                                
                      AUTONOMOUS AGENT SYSTEM STATUS REPORT                     
                                                                                

Generated: 4/10/2025, 9:30:01 AM
Project: MysticOracleV2
Phase: Development
Away Mode: INACTIVE

=== System Information ===
CPU: 8 cores
Memory: 15.92 GB / 16 GB (99.50%)
Uptime: 1d 10h 26m 28s

=== Agent Status ===
Total Agents: 13

Running Agents:
┌────────┬──────────────┬────────────┬────────────┬────────────────────────┐
│ PID     │ Type          │ CPU Usage  │ Mem Usage  │ Start Time              │
├────────┼──────────────┼────────────┼────────────┼────────────────────────┤
│ 96946   │ Agent        │ 3.0      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 14753   │ Agent        │ 3.0      % │ 0.3      % │ 4/10/2025, 9:30:01 AM  │
│ 8710    │ Agent        │ 0.6      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 16678   │ Agent        │ 0.4      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 3288    │ Agent        │ 0.1      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 13353   │ Agent        │ 0.1      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 18683   │ Agent        │ 0.1      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 18665   │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 16726   │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 9027    │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 9011    │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 8725    │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 9:30:01 AM  │
│ 14742   │ Agent        │ 0.0      % │ 0.0      % │ 4/10/2025, 9:30:01 AM  │
└────────┴──────────────┴────────────┴────────────┴────────────────────────┘

=== Task Status ===
Total Tasks: 5

Configured Tasks:
┌──────────────┬──────────────┬────────────────────────────────┬────────────┬────────────────────────┐
│ Agent         │ Task          │ Description                   │ Priority    │ Next Run               │
├──────────────┼──────────────┼────────────────────────────────┼────────────┼────────────────────────┤
│ deployment   │ deploy       │ Deploy the project               │ normal     │ 4/11/2025, 8:38:50 AM  │
│ status       │ status-report │ Generate status report           │ normal     │ 4/11/2025, 5:36:50 AM  │
│ code         │ lint         │ Lint the code                    │ normal     │ 4/10/2025, 1:31:05 PM  │
│ code         │ test         │ Run tests                        │ normal     │ 4/10/2025, 1:08:17 PM  │
│ Workflow     │ deploy-and-notify │ Deploy the project and send notification │ normal     │ 4/10/2025, 3:16:09 PM  │
└──────────────┴──────────────┴────────────────────────────────┴────────────┴────────────────────────┘

=== Project Status ===
Current Phase: Development
Next Milestone: Initial Deployment

Progress:
overall: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%

Active Tasks:
┌────────────┬────────────────────────────────┬────────────┬────────────┐
│ Assigned To  │ Task                          │ Status      │ Progress    │
├────────────┼────────────────────────────────┼────────────┼────────────┤
│            │ deploy                           │ failed     │ ░░░░░░░░░░ 0% │
└────────────┴────────────────────────────────┴────────────┴────────────┘

Recent Completed Tasks:
┌────────────┬────────────────────────────────┬────────────┬────────────────────────┐
│ Assigned To  │ Task                          │ Status      │ Completion Time        │
├────────────┼────────────────────────────────┼────────────┼────────────────────────┤
│            │ lint                             │ failed     │ Invalid Date           │
│            │ test                             │ failed     │ Invalid Date           │
│            │ test                             │ failed     │ Invalid Date           │
│            │ test                             │ failed     │ Invalid Date           │
│            │ test                             │ failed     │ Invalid Date           │
└────────────┴────────────────────────────────┴────────────┴────────────────────────┘

=== Recent Logs ===

Agent Runner:
(node:2565) ExperimentalWarning: CommonJS module /Users/kfitz/.nvm/versions/node/v23.1.0/lib/node_modules/netlify-cli/node_modules/debug/src/node.js is loading ES Module /Users/kfitz/.nvm/versions/node/v23.1.0/lib/node_modules/netlify-cli/node_modules/supports-color/index.js using require().
Support for loading ES Module in require() is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 ›   Error: unknown option '--yes'
 ›   See more help with --help
[0m
[31mWorkflow deploy-and-notify failed at step 3: deployment/deploy[0m
[31mWorkflow deploy-and-notify failed: undefined[0m
Status report scheduled


Agent Status:
logsDir is not defined
ReferenceError: logsDir is not defined
    at generateStatusReport (file:///Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/status-report.js:398:32)
    at async main (file:///Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/status-report.js:611:5)
[2025-04-10T06:04:05.957Z] ERROR: Unhandled error in main function
logsDir is not defined
ReferenceError: logsDir is not defined
    at generateStatusReport (file:///Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/status-report.js:398:32)
    at async main (file:///Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/status-report.js:611:5)


Agent Stdout:
../dist/public/assets/design-system-page-BIqJ7b-Z.js       14.62 kB │ gzip:   2.79 kB
../dist/public/assets/tarot-page-improved-BsTYaRre.js      17.24 kB │ gzip:   4.98 kB
../dist/public/assets/agent-learning-demo-B9isqjxE.js      23.05 kB │ gzip:   6.68 kB
../dist/public/assets/format-C2QEweiC.js                   23.93 kB │ gzip:   7.10 kB
../dist/public/assets/tarot-cards-page-BhXe5cQN.js         44.27 kB │ gzip:  11.97 kB
../dist/public/assets/index-O-yEuxPH.js                    86.95 kB │ gzip:  24.20 kB
../dist/public/assets/astrology-page-B_tMm_O2.js           89.71 kB │ gzip:  27.00 kB
../dist/public/assets/index-CSwnePv_.js                   675.81 kB │ gzip: 208.92 kB
✓ built in 21.73s


Agent Stderr:
(node:5622) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/agent-runner.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)

