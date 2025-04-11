
                                                                                
                      AUTONOMOUS AGENT SYSTEM STATUS REPORT                     
                                                                                

Generated: 4/10/2025, 11:30:00 PM
Project: MysticOracleV2
Phase: Development
Away Mode: ACTIVE

=== System Information ===
CPU: 8 cores
Memory: 15.16 GB / 16 GB (94.73%)
Uptime: 2d 0h 26m 27s

=== Agent Status ===
Total Agents: 12

Running Agents:
┌────────┬──────────────┬────────────┬────────────┬────────────────────────┐
│ PID     │ Type          │ CPU Usage  │ Mem Usage  │ Start Time              │
├────────┼──────────────┼────────────┼────────────┼────────────────────────┤
│ 79909   │ Agent        │ 11.5     % │ 0.3      % │ 4/10/2025, 11:30:00 PM │
│ 16678   │ Agent        │ 0.2      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 18665   │ Agent        │ 0.2      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 8710    │ Agent        │ 0.2      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 13353   │ Agent        │ 0.1      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 9011    │ Agent        │ 0.1      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 18683   │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 16726   │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 9027    │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 8725    │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 96946   │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 11:30:00 PM │
│ 3288    │ Agent        │ 0.0      % │ 0.1      % │ 4/10/2025, 11:29:59 PM │
└────────┴──────────────┴────────────┴────────────┴────────────────────────┘

=== Task Status ===
Total Tasks: 5

Configured Tasks:
┌──────────────┬──────────────┬────────────────────────────────┬────────────┬────────────────────────┐
│ Agent         │ Task          │ Description                   │ Priority    │ Next Run               │
├──────────────┼──────────────┼────────────────────────────────┼────────────┼────────────────────────┤
│ deployment   │ deploy       │ Deploy the project               │ normal     │ 4/11/2025, 9:12:50 AM  │
│ status       │ status-report │ Generate status report           │ normal     │ 4/11/2025, 5:48:39 PM  │
│ code         │ lint         │ Lint the code                    │ normal     │ 4/11/2025, 3:56:29 AM  │
│ code         │ test         │ Run tests                        │ normal     │ 4/11/2025, 8:46:21 PM  │
│ Workflow     │ deploy-and-notify │ Deploy the project and send notification │ normal     │ 4/11/2025, 1:50:36 PM  │
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
│            │ test                             │ failed     │ Invalid Date           │
│            │ status-report                    │ failed     │ Invalid Date           │
│            │ status-report                    │ failed     │ Invalid Date           │
│            │ status-report                    │ failed     │ Invalid Date           │
│            │ status-report                    │ failed     │ Invalid Date           │
└────────────┴────────────────────────────────┴────────────┴────────────────────────┘

=== Recent Logs ===

Agent Runner:
[31mWorkflow deploy-and-notify failed: undefined[0m
Status report scheduled
Status report scheduled
Executing task: status/status-report
[32mTask status/status-report executed successfully: Script executed successfully[0m
[32mTask status/status-report completed successfully[0m
Status report scheduled
Status report scheduled
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


Agent Stderr:
(node:5622) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/agent-runner.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)




Agent Stderr:
(node:5622) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/agent-runner.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kfitz/MysticOracleV2/MysticOracleV2/.mcp/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)

