 # Cotravelers  
  
App where you can join on trips created by other people or create your own and other people will be able to join yours.  
  
  
## Getting started  
  
These instructions will give you a copy of the project to run it on your local machine for development and testing purposes.  
  
### Prerequisites  
  
To clone and run this application, you will need Git and Node.js (which comes with npm) installed on your computer.
  
	
### Installation  
  
```bash
# Clone this repository
$ git clone https://github.com/sarajoseph/cotravelers.git

# Go into the repository
$ cd cotravelers

# Install dependencies
$ npm install

# Run the app
$ npm run dev
```
  
  
## Dependencies  
  
[<img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />](https://vitejs.dev)[<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />](https://react.dev)[<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">](https://typescriptlang.org)[<img src="https://img.shields.io/badge/Tailwind_CSS-0b1120?style=for-the-badge&logo=tailwind-css&logoColor=06B6D4">](https://tailwindcss.com)[<img src="https://img.shields.io/badge/eslint-white?style=for-the-badge&logo=eslint&logoColor=4B32C3">](https://eslint.org)[<img src="https://img.shields.io/badge/standardJS-F3DF49?style=for-the-badge&logo=standardJS&logoColor=black">](https://standardjs.com)[<img src="https://img.shields.io/badge/vitest-1b1b1f?style=for-the-badge&logo=vitest&logoColor=fcc72b">](https://vitest.dev)    

Vite (https://vitejs.dev)  
ReactJS (https://react.dev)  
Typescript (https://typescriptlang.org)  
Tailwind (https://tailwindcss.com)  
ESLint (https://eslint.org)  
TSStandardJS (https://standardjs.com)  
Vitest (https://vitest.dev)  
Firebase (https://firebase.google.com)  
  
  
## Notes  
  
### Tailwind compilation  
  
Only the Tailwind classes that are used are loaded. When adding a new one, it must be added to the css file.  
```bash
# Run
npx tailwindcss -i ./src/assets/css/tailwind-input.css -o ./src/assets/css/tailwind-output.css --watch
```
  
  
### ESLint StandardJS test  
  
Find and fix problems with your JavaScript code
```bash
# Run
npx standard

# or
npm test
```
  
  
### Test with Vitest    
  
```bash
# Run
npx vitest
```