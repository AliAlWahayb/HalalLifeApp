import os
import re
import sys

def enforce_pascal_case(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    errors = []
    for line_num, line in enumerate(lines, start=1):
        class_match = re.search(r'class\s+([a-zA-Z0-9_]+)', line)
        function_match = re.search(r'def\s+([a-zA-Z0-9_]+)', line)

        if class_match:
            class_name = class_match.group(1)
            if not class_name[0].isupper() or "_" in class_name:
                errors.append(f"{file_path}:{line_num}: Class '{class_name}' should be PascalCase")

        if function_match:
            func_name = function_match.group(1)
            if not func_name[0].isupper() or "_" in func_name:
                errors.append(f"{file_path}:{line_num}: Function '{func_name}' should be PascalCase")

    return errors

def main():
    project_root = "app"  # Change based on your repo structure
    errors = []
    for root, _, files in os.walk(project_root):
        for file in files:
            if file.endswith(".py"):
                errors.extend(enforce_pascal_case(os.path.join(root, file)))

    if errors:
        print("\n".join(errors))
        sys.exit(1)

if __name__ == "__main__":
    main()
