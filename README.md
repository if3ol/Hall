# Hall

## What is Hall?
Hall is a mobile web app designed as a forum for students where verified users can freely and anonymously exchange information, ideas, and engage in shared interests through topic-based and school-based channels.

We want to bring the benefits of some restricted platforms with a similar model and more to students across all univerisities. Here students can all connect with and learn from their peers in similar or different situations and fields without the pressure of online personas.


## Set-Up
### Set-up Back-end

```bash
# 1. Change working directory to back-end folder
cd BackEnd

# 2. Create python virtual env
python3 -m venv env

# 3. Enter env (need to be in it here to run server)
	# 3.1 (For Windows)
./env/Scripts/activate
	# 3.1 (For Mac)
source ./env/bin/activate

# 4. Install requirements
pip install -r requirements.txt

# 5. Create `.env` and set the following values
	DATABASE_URL
	DEBUG (True or False)

# 6. Run app
python3 app.py

```

- `.env` File Content
```jsx
DATABASE_URL='postgresql://<postgres:<db_secret>@<db_host>/<db_name>>'
DEBUG=True
```

### Set Up Front-end
```bash
# 1. Change working directory to front-end folder
cd /FrontEnd

# 2. Install node modules
npm i

# 3. Create .env file and set the following values
	REACT_APP_API_BASE_URL
	
# 4. Run the app
npm start
```

Example of a working `.env`
```jsx
REACT_APP_API_BASE_URL='http://127.0.0.1:5000'
```