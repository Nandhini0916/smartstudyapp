const math = require('mathjs');
const axios = require('axios');

class MathService {
  solveQuadratic(a, b, c) {
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
      return { 
        solutions: [], 
        type: 'complex',
        discriminant 
      };
    }
    
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    
    return {
      solutions: [x1, x2],
      discriminant,
      type: 'real'
    };
  }

  solveEquation(equation) {
    try {
      const result = math.simplify(equation);
      const solutions = math.solve(equation);
      return {
        simplified: result.toString(),
        solutions: solutions.map(s => s.toString()),
        steps: this.generateSteps(equation)
      };
    } catch (error) {
      throw new Error('Invalid equation format');
    }
  }

  generateSteps(equation) {
    const steps = [];
    let current = equation;
    
    steps.push(`Start with: ${equation}`);
    
    // Add step-by-step transformation logic here
    // This is simplified - integrate with CAS libraries for real step generation
    
    return steps;
  }

  differentiate(expression, variable = 'x') {
    try {
      const derivative = math.derivative(expression, variable);
      return {
        original: expression,
        derivative: derivative.toString(),
        steps: [`Apply derivative rule to ${expression}`, `Result: ${derivative.toString()}`]
      };
    } catch (error) {
      throw new Error('Differentiation failed');
    }
  }

  integrate(expression, variable = 'x') {
    try {
      // Note: Integration requires more complex CAS
      // Use symbolic computation libraries or external API
      const integral = math.integrate(expression, variable);
      return {
        original: expression,
        integral: integral.toString(),
        steps: [`Integrate ${expression} with respect to ${variable}`, `Result: ${integral.toString()} + C`]
      };
    } catch (error) {
      throw new Error('Integration failed');
    }
  }
}

module.exports = new MathService();