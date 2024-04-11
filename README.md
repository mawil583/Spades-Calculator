# Spades Calculator

## In order to run the app locally,

1. Clone the repository in the directory of your choice.
2. Open your Terminal and **cd** into the root directory of the project.
3. Run **npm i** to download server dependencies.
4. Run **npm start**.
5. Now your project should be viewable in your browser at **http://localhost:3000/**.

- You may be asked permission for the project to open the website in your browser. It's safe to grant that permission.

_note: the server is listening on port 5000. The frontend makes requests on port 3000. A proxy has been set up in the frontend package.json which references port 5000 so that it can receive information from the server._
