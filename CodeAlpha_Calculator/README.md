# **Calculator**
A calculator with full operator precedence and parentheses support, built with HTML, CSS, and vanilla JavaScript, created as part of the _CodeAlpha Frontend Development Internship_.

## **Features**
+ Full arithmetic support — addition, subtraction, multiplication, division, and exponentiation (`**`)
+ Correct operator precedence and parentheses, evaluated with the Shunting-yard algorithm:
  1. The typed expression (infix notation) is tokenized and converted to postfix notation (RPN)
  2. The postfix expression is then evaluated left to right using a stack
  3. Multiplication, division, and exponentiation are correctly resolved before addition and subtraction, and parentheses always take priority

+ Real-time result preview — shows the live result as you type, once the expression looks complete (Google Pixel-style)
+ Calculation history — every result is saved to a scrollable history panel, with a button to clear it
+ Full keyboard support — numbers, operators, parentheses, `Enter` to calculate, `Backspace` to delete, `Escape` to clear
+ Smart input validation — blocks invalid sequences as you type: double operators, a misplaced dot, more than one dot per number, unbalanced parentheses, or a triple `*`
+ Fully responsive — adapts to desktop, tablet, and mobile screens, with tap-friendly controls
+ Hover effects and smooth CSS transitions throughout

## **Tech Stack**
+ HTML5
+ CSS3 (Flexbox, CSS Grid, transitions)
+ Vanilla JavaScript (Shunting-yard algorithm, DOM manipulation, no frameworks/libraries)
+ Google Fonts (Orbitron)

## **Project Structure**
```
CodeAlpha_Calculator/
├── index.html
├── style.css
├── script.js
└── (icon assets)
```

## **How to Run**

Open [Calculator](https://daniilgk.github.io/CodeAlpha_Calculator/) in your browser.

## **Author**

## Made by [DaniilGK](https://github.com/DaniilGK) for the CodeAlpha Frontend Development Internship.
