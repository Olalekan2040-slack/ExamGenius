"""
ExamGenius - JAMB Exam Preparation Platform
Setup configuration for package installation
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README for long description
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding="utf-8")

# Read requirements
requirements = (this_directory / "requirements.txt").read_text().splitlines()
requirements = [r.strip()
                for r in requirements if r.strip() and not r.startswith("#")]

setup(
    name="examgenius",
    version="1.0.0",
    author="ExamGenius Team",
    author_email="support@examgenius.com",
    description="Professional JAMB Exam Preparation Platform with AI-powered learning",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/examgenius",
    packages=find_packages(exclude=["tests*", "docs*"]),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Education",
        "Topic :: Education :: Testing",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Framework :: FastAPI",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "pytest-asyncio>=0.21.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
            "pre-commit>=3.0.0",
        ],
        "docs": [
            "mkdocs>=1.4.0",
            "mkdocs-material>=9.0.0",
            "mkdocstrings[python]>=0.20.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "examgenius-init=scripts.init_db:main",
        ],
    },
    include_package_data=True,
    package_data={
        "app": ["py.typed"],
    },
)
