## Players connected

 - Players have an id generated on the server before match begin, which is stored in the server-side match information.
 - The server emits match begin with the newly generated player ids stored under the game id.

## Player makes an action

 - Player emits the action, their id and the game id to the server.
 - The server checks the id against the match data.
 - The server ensures that this is a valid action.
 - The server updates the server-side match data accordingly.
 - The server emits that action to both of the clients.
 - Both of the clients update the interface accordingly.
