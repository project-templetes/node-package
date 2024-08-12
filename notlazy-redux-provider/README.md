Redux Provider CLI
# Overview
Redux Provider CLI is a command-line tool designed to help you quickly create a Redux provider with a particular structure. This tool ensures that you follow a consistent structure, making it faster and easier to use code that you frequently utilize in your projects.

## Features
- Consistent Structure: Enforces a particular structure for your Redux provider, ensuring consistency across your projects.
- Quick Setup: Speeds up the process of setting up a Redux provider, saving you time and effort.
- Interactive Prompts: Uses inquirer to provide an interactive command-line interface for easy configuration.

## Installation
To install Redux Provider CLI, you need to have Node.js and npm installed on your machine. Then, you can install the package globally using the following command:

```bash
npx notlazy-redux-provider # recomended
```

or

```bash
npm install -g notlazy-redux-provider
notlazy-redux-provider
```

The CLI will prompt you with a series of questions to configure your Redux provider. Answer the questions, and the tool will generate the necessary files and structure for you.

## Example
Here is an example of how to use the CLI:

```bash
$ npx notlazy-redux-provider
? Where do you want to create the redux-provider? src
? Is this the correct directory? /project/src yes
? Enter the name of the directory redux-provider
? What type of project you are using? Next
? Are you using TypeScript? yes
->  project/src/redux-provider 
->  Next TS 
```
Redux provider structure created successfully.

After answering the prompts, the CLI will generate the following structure:

```bash
redux-provider/
├── index.tsx
├── states
│   └── auth.ts
└── use-local-storage.ts
1 directory, 3 files
```


## Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request. We welcome all contributions!

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact
If you have any questions or feedback, please open an issue on the GitHub repository.

By using Redux Provider CLI, you can ensure that your Redux providers follow a consistent structure, making your development process more efficient and organized.

