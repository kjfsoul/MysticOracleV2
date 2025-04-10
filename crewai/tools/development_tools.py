import os
import json
import subprocess
from typing import List, Dict, Any, Optional
from crewai import Tool

class DevelopmentTools:
    """
    Collection of tools for development-related operations.
    """
    
    @staticmethod
    def get_file_reader_tool() -> Tool:
        """
        Creates a tool for reading files from the project.
        
        Returns:
            Tool: A CrewAI tool for reading files
        """
        def read_file(file_path: str) -> str:
            """
            Read a file from the project.
            
            Args:
                file_path: Path to the file relative to the project root
            
            Returns:
                str: The content of the file
            """
            # Get the absolute path to the project root
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            
            # Construct the absolute path to the file
            abs_path = os.path.join(project_root, file_path)
            
            # Check if the file exists
            if not os.path.exists(abs_path):
                return f"Error: File not found at {file_path}"
            
            # Read the file
            try:
                with open(abs_path, 'r') as f:
                    content = f.read()
                return content
            except Exception as e:
                return f"Error reading file: {str(e)}"
        
        return Tool(
            name="FileReader",
            description="Read a file from the project",
            func=read_file
        )
    
    @staticmethod
    def get_file_writer_tool() -> Tool:
        """
        Creates a tool for writing files to the project.
        
        Returns:
            Tool: A CrewAI tool for writing files
        """
        def write_file(file_path: str, content: str) -> str:
            """
            Write content to a file in the project.
            
            Args:
                file_path: Path to the file relative to the project root
                content: Content to write to the file
            
            Returns:
                str: Success or error message
            """
            # Get the absolute path to the project root
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            
            # Construct the absolute path to the file
            abs_path = os.path.join(project_root, file_path)
            
            # Create directories if they don't exist
            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            
            # Write the file
            try:
                with open(abs_path, 'w') as f:
                    f.write(content)
                return f"Successfully wrote to {file_path}"
            except Exception as e:
                return f"Error writing file: {str(e)}"
        
        return Tool(
            name="FileWriter",
            description="Write content to a file in the project",
            func=write_file
        )
    
    @staticmethod
    def get_code_analyzer_tool() -> Tool:
        """
        Creates a tool for analyzing code.
        
        Returns:
            Tool: A CrewAI tool for analyzing code
        """
        def analyze_code(code: str, language: str) -> Dict[str, Any]:
            """
            Analyze code for issues and improvements.
            
            Args:
                code: The code to analyze
                language: The programming language of the code
            
            Returns:
                Dict[str, Any]: Analysis results
            """
            # This is a placeholder for actual code analysis
            # In a real implementation, this would use a linter or other analysis tools
            
            issues = []
            suggestions = []
            
            # Simple analysis based on language
            if language.lower() == "javascript" or language.lower() == "typescript":
                # Check for console.log statements
                if "console.log" in code:
                    issues.append("Contains console.log statements that should be removed in production")
                
                # Check for TODO comments
                if "TODO" in code:
                    issues.append("Contains TODO comments that should be addressed")
                
                # Check for proper error handling
                if "try" in code and "catch" not in code:
                    issues.append("Missing error handling in try block")
                
                # Suggestions
                if "function" in code and "async" not in code and "await" in code:
                    suggestions.append("Consider adding async keyword to functions that use await")
                
                if "var " in code:
                    suggestions.append("Consider using let or const instead of var")
            
            elif language.lower() == "python":
                # Check for print statements
                if "print(" in code:
                    issues.append("Contains print statements that should be replaced with proper logging")
                
                # Check for TODO comments
                if "# TODO" in code:
                    issues.append("Contains TODO comments that should be addressed")
                
                # Suggestions
                if "except:" in code and "Exception" not in code:
                    suggestions.append("Consider catching specific exceptions instead of all exceptions")
                
                if "import *" in code:
                    suggestions.append("Consider importing specific modules instead of using wildcard imports")
            
            return {
                "issues": issues,
                "suggestions": suggestions,
                "complexity": "medium" if len(code.split("\n")) > 50 else "low"
            }
        
        return Tool(
            name="CodeAnalyzer",
            description="Analyze code for issues and improvements",
            func=analyze_code
        )
    
    @staticmethod
    def get_component_finder_tool() -> Tool:
        """
        Creates a tool for finding React components in the project.
        
        Returns:
            Tool: A CrewAI tool for finding components
        """
        def find_components(query: str) -> List[Dict[str, str]]:
            """
            Find React components in the project that match the query.
            
            Args:
                query: Search query for component names or content
            
            Returns:
                List[Dict[str, str]]: List of matching components with paths and descriptions
            """
            # Get the absolute path to the project root
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            
            # Define the components directory
            components_dir = os.path.join(project_root, "client/src/components")
            
            # Check if the directory exists
            if not os.path.exists(components_dir):
                return [{"error": f"Components directory not found at {components_dir}"}]
            
            # Use grep to find components matching the query
            try:
                # Use grep to search for the query in component files
                cmd = f"grep -r '{query}' {components_dir} --include='*.tsx' --include='*.jsx'"
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                
                if result.returncode != 0 and result.returncode != 1:  # grep returns 1 if no matches
                    return [{"error": f"Error searching for components: {result.stderr}"}]
                
                # Parse the results
                components = []
                for line in result.stdout.split("\n"):
                    if line.strip():
                        parts = line.split(":", 1)
                        if len(parts) >= 2:
                            file_path = parts[0].replace(project_root + "/", "")
                            content = parts[1]
                            
                            # Extract component name from file path
                            component_name = os.path.basename(file_path).split(".")[0]
                            
                            components.append({
                                "name": component_name,
                                "path": file_path,
                                "match": content.strip()
                            })
                
                return components if components else [{"message": f"No components found matching '{query}'"}]
            
            except Exception as e:
                return [{"error": f"Error searching for components: {str(e)}"}]
        
        return Tool(
            name="ComponentFinder",
            description="Find React components in the project that match a query",
            func=find_components
        )
