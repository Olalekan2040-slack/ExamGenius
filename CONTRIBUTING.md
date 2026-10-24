# Contributing to EduLab ExamPrep

Thank you for considering contributing to EduLab ExamPrep! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Use the bug report template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Features

1. Check if the feature has been suggested
2. Describe the feature clearly
3. Explain the use case
4. Consider implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m "Add: Brief description of changes"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create Pull Request**

## Development Setup

See [README.md](README.md#development) for setup instructions.

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use descriptive variable names

### Docstrings
```python
def function_name(param1: str, param2: int) -> bool:
    """
    Brief description of function
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        bool: Description of return value
        
    Raises:
        ValueError: When invalid input
    """
    pass
```

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Start with verb: Add, Update, Fix, Remove, Refactor
- Keep first line under 50 characters
- Add detailed description if needed

## Testing

- Write tests for new features
- Maintain test coverage above 80%
- Run tests before submitting PR:
  ```bash
  pytest tests/
  ```

## Questions?

Feel free to ask questions by opening an issue with the "question" label.

Thank you for contributing! 🎉
