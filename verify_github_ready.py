# verify_github_ready.py
"""
Script to verify that the project is properly configured for GitHub.
Checks that sensitive files are properly excluded.
"""

import os
import subprocess
from pathlib import Path

def check_gitignore_exists():
    """Check if .gitignore file exists"""
    return os.path.exists('.gitignore')

def check_ml_env_excluded():
    """Check if ml_env is listed in .gitignore"""
    try:
        with open('.gitignore', 'r') as f:
            content = f.read()
            return 'ml_env/' in content
    except:
        return False

def check_git_status():
    """Check git status to see if ml_env would be committed"""
    try:
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True)
        output = result.stdout
        # Check if ml_env appears in status
        return 'ml_env/' not in output
    except:
        return None

def get_excluded_items():
    """List items that should be excluded"""
    excluded = [
        'ml_env/',
        '__pycache__/',
        '.ipynb_checkpoints/',
        '*.pyc',
        '.env'
    ]
    return excluded

def main():
    print("=" * 60)
    print("🔍 GITHUB READINESS VERIFICATION")
    print("=" * 60)
    print()
    
    # Check 1: .gitignore exists
    print("✓ Checking .gitignore file...")
    if check_gitignore_exists():
        print("  ✅ .gitignore file exists")
    else:
        print("  ❌ .gitignore file NOT FOUND!")
        return
    
    # Check 2: ml_env is in .gitignore
    print("\n✓ Checking ml_env exclusion...")
    if check_ml_env_excluded():
        print("  ✅ ml_env/ is listed in .gitignore")
    else:
        print("  ❌ ml_env/ NOT found in .gitignore!")
        return
    
    # Check 3: Git status
    print("\n✓ Checking git status...")
    status = check_git_status()
    if status is None:
        print("  ⚠️  Git not initialized or not available")
        print("  Run: git init")
    elif status:
        print("  ✅ ml_env/ will NOT be committed")
    else:
        print("  ❌ WARNING: ml_env/ appears in git status!")
        print("  This means it might be committed!")
    
    # Check 4: Required files
    print("\n✓ Checking required files...")
    required_files = [
        'README.md',
        'requirements.txt',
        'LICENSE',
        '.gitattributes',
        'GITHUB_SETUP.md'
    ]
    
    all_present = True
    for file in required_files:
        if os.path.exists(file):
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} missing")
            all_present = False
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    
    if all_present and status and check_ml_env_excluded():
        print("✅ ✅ ✅ PROJECT IS GITHUB READY! ✅ ✅ ✅")
        print("\nNext steps:")
        print("1. git commit -m 'Initial commit'")
        print("2. git remote add origin <your-github-url>")
        print("3. git push -u origin main")
    else:
        print("⚠️  Some issues found. Please review the checks above.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
