# tic-tac-toe
My attempt to code a full-stack website of a multiplayer game inclusive to screen reader users :)

Website URL: [https://magd-tic-tac-toe.herokuapp.com/](https://magd-tic-tac-toe.herokuapp.com/)

## Available scripts
In the project directory, you can run:
1. Install server dependencies.
```
cd server
npm install 
```

2. Install public dependencies.
```
cd react-client
npm install
```

3. In the server directory, set value of MONGODB_URL, JWT_SECRET, PORT.

4. In the server directory, run 
```
npm start
```

5. In the client directory, run
```
npm start
```

6. On two separate windows, open [http://localhost:3000/](http://localhost:3000/) to view the website's register page. 

7. Register two accounts and start playing!

**Sample API requests using Postman are in the images folder.**


## Assumptions
- A user must know the other player's username to be able to play with them.
- A user cannot be in more than 1 game room at one time.

## Interpretation of requirements and Design Considerations
- To make the website accessible,
     - every item should ideally have a textual representation, even if it isn't visible. 
     - I made use of **semantic HTML** (main, section, nav etc.) and `React.Fragment` (does not add to DOM) instead of divs.
     - I placed focus on manual focus management.
        - If user input triggers an error, use `useEffect()` with `input.error.focus()` to return focus back to the input field/element after displaying alert message/once a component renders. e.g. User returns to user input field after entering an invalid username/User brought to username field immediately upon loading of registration page
     - I used ria attributes e.g. `aria-live="assertive"` so screen reader announces errMsg, `aria-invalid` and 'aria-describedBy' for screen reader to read requirements of all input fields 
     - Placed errMsg `"offscreen"` instead of `display:none` so it is accessible to screen readers.
     - Matched label to input using `htmlFor` and `id` respectively so screen readers can read requirements of input 
     - Use heading labels and `tabindex` to ensure keyboard accessibility (especially for interactive elements e.g. input and button)
- Since users have a unique identifier, each user has a **unique username as specified in the UserSchema model**. 
- User must **register for an account first** to be authenticated.
- A user can click on **"View Past Games" button** to view his past games (includes outcome(win/lose) of each game and which user he/she played with)
- Game moves are made by 2 human users, hence **both users must be online and join the same room** for the game to start. This is done using web sockets to check the size of each room. User can only make a move once both players are in the game to ensure fairness.
- Game ends when a **user wins, loses or tie**. Both users will be alerted of game outcome and **will not be allowed to make any more moves** once the game ends.

## Architecture: MERN
This full-stack multiplayer tic tac toe was built using React.js on the frontend and Express and Node.js on the backend. MongoDB was my choice of nosql database for storing user information.
![MERN architecture diagram](https://webimages.mongodb.com/_com_assets/cms/mern-stack-b9q1kbudz0.png?auto=format%2Ccompress "MERN architecture diagram").

## To dos/AFI:
- Use appropriate ARIA attributes/npm packages to ensure keyboard accessibility.
- Separate out CSS from the JS component files. 
- Work on **Separation of concerns** in directory: separate code for displaying past game history from the code for hosting the multiplayer game.
- Include the date of past games and statistics of winning/loss rate.
- Implement more features like changing password/playing with a bot

