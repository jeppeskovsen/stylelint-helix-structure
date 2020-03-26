# stylelint-scss-helix-structure

Install via npm:
```
npm install styleint-scss-helix-structure --save-dev
```

.stylelintrc:
```javascript
"plugins": [
    "stylelint-scss-helix-structure"
],
"rules": {
  "helix-structure/restricted-imports": [true, { 
    "basePath": "./src",
    "alias": {
      "~": "./"
    }
  }],
  "helix-structure/restricted-tilde-imports": [true, { 
    "basePath": "./src",
    "ignoreFix": false,
    "alias": {
      "~": "./"
    }
  }],
  ...
```
 