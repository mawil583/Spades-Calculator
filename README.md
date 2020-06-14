# myPersonalPraject

## In order to run the app locally,
1. Open your Terminal and **cd** into the **server** folder of the project repo.
2. Run **npm start**.
3. Open the project repo in VS Code.
4. From your VS Code Terminal, **cd** into the **client** folder.
5. From here run **npm start**. Now your project should be viewable in your browser at **http://localhost:3000/**.

*note: the server is listening on port 5000. The frontend makes requests on port 3000. A proxy has been set up in the frontend package.json which references port 5000 so that it can receive information from the server.*
