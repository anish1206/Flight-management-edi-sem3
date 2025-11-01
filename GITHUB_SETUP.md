# GitHub Setup Guide

## 🚀 Pushing Your Project to GitHub

Follow these steps to push your project to GitHub:

### Step 1: Initialize Git Repository

```bash
# Navigate to your project directory
cd "c:\Users\ANISH\Desktop\Flight_management_model_training"

# Initialize git repository
git init

# Add all files (gitignore will exclude ml_env and other unnecessary files)
git add .

# Create your first commit
git commit -m "Initial commit: Flight Management Model Training project"
```

### Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `flight-management-model-training`)
5. Choose visibility (Public or Private)
6. **DO NOT** initialize with README, .gitignore, or license (we already have them)
7. Click "Create repository"

### Step 3: Connect Local Repository to GitHub

```bash
# Add the remote repository (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/flight-management-model-training.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files except:
   - `ml_env/` (virtual environment)
   - `__pycache__/` folders
   - `.ipynb_checkpoints/`
   - Other files listed in `.gitignore`

## 📦 Handling Large Files (Optional)

If your model files (`.h5`, `.joblib`) are very large (>100MB), consider using Git LFS:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.h5"
git lfs track "*.joblib"

# Update .gitattributes and commit
git add .gitattributes
git commit -m "Configure Git LFS for large model files"
git push
```

## 🔒 Security Checklist

✅ Virtual environment (`ml_env/`) is excluded via `.gitignore`
✅ No API keys or passwords in code
✅ No sensitive personal information
✅ Cache files and temporary files excluded
✅ IDE-specific files excluded

## 🔄 Making Future Changes

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## 📝 Repository Settings Recommendations

After pushing, configure these settings on GitHub:

1. **About section**: Add description and topics (machine-learning, lstm, predictive-maintenance, tensorflow)
2. **README**: Should display automatically on your repo homepage
3. **Branch protection**: Consider protecting the main branch
4. **GitHub Pages**: Optional - for documentation
5. **Issues & Projects**: Enable for project management

## 🌟 Making Your Repository Stand Out

- Add badges to README (build status, license, Python version)
- Include example predictions and visualizations
- Add a `CONTRIBUTING.md` file
- Create GitHub Actions for CI/CD
- Add code documentation with docstrings

## 🆘 Troubleshooting

### Large File Error
If you get an error about file size:
```bash
# Remove file from staging
git rm --cached model_artifacts/lstm_model.h5

# Use Git LFS or add to .gitignore
echo "model_artifacts/*.h5" >> .gitignore
git add .gitignore
git commit -m "Exclude large model files"
```

### Authentication Error
If using HTTPS and getting authentication errors:
- Use a Personal Access Token instead of password
- Or use SSH: `git remote set-url origin git@github.com:YOUR_USERNAME/repo.git`

---

**Need Help?** Check [GitHub's documentation](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)
