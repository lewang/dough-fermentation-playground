from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="fermentation-predictor",
    version="1.0.0",
    author="Fermentation Prediction Tool",
    author_email="",
    description="A machine learning tool for predicting fermentation parameters",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Science/Research",
        "Topic :: Scientific/Engineering :: Bio-Informatics",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.7",
    install_requires=requirements,
    entry_points={
        "console_scripts": [
            "fermentation-predict=main:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["data/*.csv"],
    },
    keywords="fermentation, machine learning, prediction, biotechnology, food science",
    project_urls={
        "Bug Reports": "",
        "Source": "",
        "Documentation": "",
    },
)