# Refactoring Agent

The Refactoring Agent is an automated system that analyzes your codebase and performs refactoring at scheduled intervals. It helps maintain code quality by identifying and fixing common issues like code duplication, excessive complexity, poor naming, and structural problems.

## Features

- **Scheduled Refactoring**: Runs automatically at configured intervals
- **Multiple Refactoring Types**: Supports various refactoring strategies
- **Configurable**: Extensive configuration options to control behavior
- **History Tracking**: Keeps a record of all refactoring runs
- **Git Integration**: Optional auto-commit and pull request creation
- **Dry Run Mode**: Test refactoring without making actual changes

## Getting Started

### Installation

The Refactoring Agent is included in the project. No additional installation is required.

### Configuration

To configure the Refactoring Agent, run:

```bash
node scripts/agents/refactoring-manager.js configure
```

This interactive command will guide you through the configuration options.

### Starting the Scheduler

To start the Refactoring Agent scheduler:

```bash
node scripts/agents/refactoring-manager.js start
```

This will start the scheduler as a background process that will run the refactoring agent according to the configured schedule.

### Checking Status

To check the status of the Refactoring Agent:

```bash
node scripts/agents/refactoring-manager.js status
```

This will show whether the scheduler is running, the current configuration, and recent refactoring runs.

### Running Manually

To run the Refactoring Agent once without waiting for the schedule:

```bash
node scripts/agents/refactoring-manager.js run
```

### Stopping the Scheduler

To stop the Refactoring Agent scheduler:

```bash
node scripts/agents/refactoring-manager.js stop
```

## Configuration Options

### Refactoring Configuration

- **enabled**: Enable or disable the refactoring agent
- **refactoringTypes**: Types of refactoring to perform (duplication, complexity, naming, structure)
- **excludedPaths**: Directories to exclude from refactoring
- **maxFilesPerRun**: Maximum number of files to analyze per run
- **maxChangesPerFile**: Maximum number of changes to make per file
- **dryRun**: Run without making actual changes
- **autoCommit**: Automatically commit changes
- **createPullRequests**: Automatically create pull requests
- **branchPrefix**: Prefix for branches created by the agent
- **commitMessagePrefix**: Prefix for commit messages

### Scheduler Configuration

- **enabled**: Enable or disable the scheduler
- **schedule**: When to run the agent (cron syntax)
- **maxConcurrentRuns**: Maximum number of concurrent refactoring runs
- **timeoutMinutes**: Maximum runtime for each refactoring run
- **runOnStart**: Run the agent when the scheduler starts

## Refactoring Types

The Refactoring Agent supports several types of refactoring:

### Duplication

Identifies and eliminates duplicated code by extracting common functionality into reusable functions or components.

### Complexity

Reduces complexity in functions and methods by breaking them down into smaller, more manageable pieces.

### Naming

Improves variable, function, and class names to make the code more readable and self-documenting.

### Structure

Enhances code structure by reorganizing code, improving module boundaries, and applying design patterns.

## Logs and History

The Refactoring Agent keeps detailed logs and history of all refactoring runs:

- **Logs**: Located in `cline_docs/refactoring/logs/`
- **History**: Located in `cline_docs/refactoring/history/`

Each history file contains information about the files analyzed, changes made, and overall statistics for the run.

## Advanced Usage

### Adding Custom Refactoring Strategies

To add custom refactoring strategies, modify the `applyRefactoringStrategy` function in `scripts/agents/refactoring-agent.js`.

### Integration with CI/CD

The Refactoring Agent can be integrated with your CI/CD pipeline by running it as part of your build process:

```bash
node scripts/agents/refactoring-manager.js run
```

### Automating Pull Request Reviews

When using the pull request feature, you can configure automatic code review by setting up a GitHub Action or similar CI tool to run tests on the pull request.

## Troubleshooting

### Scheduler Not Starting

If the scheduler doesn't start, check:
- The log file at `cline_docs/refactoring/logs/scheduler.log`
- Ensure Node.js is properly installed
- Verify you have the necessary permissions

### Refactoring Not Working

If refactoring doesn't seem to be working:
- Check if the agent is enabled in the configuration
- Look at the log files for errors
- Try running in non-dry-run mode
- Ensure the files you expect to be refactored aren't excluded

### Process Won't Stop

If the stop command doesn't work:
- Find the process ID using `ps aux | grep refactoring`
- Manually kill the process with `kill -9 <PID>`
