from datetime import datetime, timezone
from sqlalchemy import case 
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin #libraries used for cors headers
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import func, and_
from sqlalchemy.orm import aliased
import os
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)
CORS(app) #makes our app CORS capable so that browsers allow scripting api calls

# Load environment variables
load_dotenv()

# Set database URI and track modifications
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Reflect database tables
Base = automap_base()
with app.app_context():
   Base.prepare(autoload_with=db.engine)

# Base route
@app.route('/')
@cross_origin()#make this specific route CORS capable
def index():
    return "Hello"

# Declare classes for each table using automap.
User             = Base.classes['Users']
School           = Base.classes['Schools']
ChannelCategory  = Base.classes['ChannelCategories']
Channel          = Base.classes['Channels']
Post             = Base.classes['Posts']
PostLike         = Base.classes['PostLikes']
Comment          = Base.classes['Comments']
CommentLike      = Base.classes['CommentLikes']
ChannelFollow    = Base.classes['ChannelFollows']
JobPosting       = Base.classes['JobPostings']
Media            = Base.classes['Media']

'''
def get_time_since(post_time): 
    """
    Return a short, human-friendly string representing the time elapsed since post_time.
    Uses abbreviations: min, hr, d, wk, mon, y.
    """
    if post_time is None:
        return "unknown"
'''
def get_time_since(post_time):
    """
    Return a short, human-friendly string representing the time elapsed since post_time.
    Uses abbreviations: min, hr, d, wk, mon, y.
    """
    if post_time is None:
        return "unknown"
    now = datetime.utcnow()
    diff = now - post_time
    seconds = diff.total_seconds()
    
    if seconds < 60:
        return "now"
    if seconds < 3600:  # less than 60 minutes
        minutes = seconds // 60
        return f"{int(minutes)}min"
    if seconds < 86400:  # less than 24 hours
        hours = seconds // 3600
        return f"{int(hours)}hr"
    
    days = seconds / 86400  # 86400 seconds in a day
    if days < 7:
        return f"{int(days)}d"
    if days < 30:
        weeks = days // 7
        return f"{int(weeks)}wk"
    if days < 365:
        months = days // 30
        return f"{int(months)}mon"
    years = days // 365
    return f"{int(years)}yr"



# Login route
@app.route('/login', methods=['POST'])
@cross_origin()#make this specific route CORS capable
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Missing username or password"}), 400
    else:
        username = data.get('username').lower()
        password = data.get('password')

        user = db.session.query(User).filter_by(username=username).first()
        if user and user.password == password:
            return jsonify({"message": "Login successful", "user_id": user.id}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
        

# sign up API
@app.route('/signup', methods = ['PUT'])
@cross_origin()#make this specific route CORS capable
def signup():
    data = request.get_json() #retrieve data from front-end
    
    #check for null username, password, email
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing username, e-mail or password"}), 400
    else: #else retrieve them
        username = data.get('username').lower()
        password = data.get('password')
        email = data.get('email').lower()
        print(email)



        # prompts db to filter by username,email and get user
        user = db.session.query(User).filter_by(username=username).first()
        print(user)
        user_email = db.session.query(User).filter_by(email=email).first()

        if user:
            return  jsonify({"message": "User account already exists"}), 409
        if user_email:
            return  jsonify({"message": "User email already in use"}), 409


        # check validity of email domain, check email uniqueness
        try:
            domain = email.split("@")[1]
        except IndexError:
            return jsonify({"error": "Invalid email format"}), 400
        
        # Query the Schools table to ensure the email's domain is valid (exists)
        school = db.session.query(School).filter_by(domain=domain).first()
        if not school:
            return jsonify({"error": "Invalid school email domain"}), 400
        
        print(datetime.now(timezone.utc))
        
        # Create a new user and associate it with the school via school_id
        new_user = User(
            username=username,
            password=password,  # Remember: hash in production!
            email=email,
            school_id=school.id,
            created_at = datetime.now(timezone.utc)
        )
        
        

        # Add the new user to the session and commit to save to the database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Signup successful", "user_id": new_user.id}), 201
    

# Trending channels endpoint
@app.route('/trending_channels', methods=['GET'])
@cross_origin()#make this specific route CORS capable
def trending_channels():
    # Retrieve pagination parameters from the query string.
    # Default offset is 0 and default limit is 5.
    offset = request.args.get("offset", default=0, type=int)
    limit = request.args.get("limit", default=5, type=int)

    # Define subqueries to fetch the media URLs for the channel photo and banner.
    photo_url_subq = db.session.query(Media.url)\
        .filter(Media.channel_id == Channel.id, Media.media_type == 'photo')\
        .order_by(Media.created_at.desc())\
        .limit(1).scalar_subquery()

    banner_url_subq = db.session.query(Media.url)\
        .filter(Media.channel_id == Channel.id, Media.media_type == 'banner')\
        .order_by(Media.created_at.desc())\
        .limit(1).scalar_subquery()

    # Query channels joined with Posts (aggregating the view_count) and ChannelCategories for the category name.
    trending = (
        db.session.query(
            Channel,
            func.sum(Post.view_count).label("total_views"),
            photo_url_subq.label("channel_photo_url"),
            banner_url_subq.label("channel_banner_url"),
            ChannelCategory.name.label("channel_category_name")
        )
        .join(Post, Channel.id == Post.channel_id)
        .join(ChannelCategory, Channel.category == ChannelCategory.id)
        .filter(Channel.affiliated_school_id == None)  # Exclude affiliated channels
        .group_by(Channel.id, photo_url_subq, banner_url_subq, ChannelCategory.name)
        .order_by(func.sum(Post.view_count).desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    # Build the channels list with the specified fields.
    channels_list = []
    for channel, total_views, channel_photo_url, channel_banner_url, channel_category_name in trending:
        display_name = getattr(channel, "channel_name", "N/A")
        channels_list.append({
            "display_name": display_name,
            "channel_id": channel.id,
            "category": channel_category_name,
            "channel_photo_url": channel_photo_url,
            "channel_banner_url": channel_banner_url
        })

    return jsonify({
        "length": len(channels_list),
        "channels": channels_list
    }), 200


#popular_post Endpoint
@app.route('/popular_posts', methods = ['GET'])
@cross_origin()#make this specific route CORS capable
def popular_posts():
    # Retrieve offset from the query string (default = 0) and ensure it's an integer.
    offset = request.args.get('offset', default=0, type=int)
    limit = request.args.get('limit', default=10, type=int)

    # Define subqueries to fetch the media URLs for the channel photo and banner.
    photo_url_subq = db.session.query(Media.url)\
        .filter(Media.channel_id == Channel.id, Media.media_type == 'photo')\
        .order_by(Media.created_at.desc())\
        .limit(1).scalar_subquery()
    
    # Build the query:
    # - Join Posts to Channels, Users (to get user information), and Schools (from user's school)
    # - Left join PostLikes to count likes per post.
    # - Group by Posts id and selected fields.
    query = (
        db.session.query(
            Post,
            Channel.channel_name.label("channel_name"),
            Channel.id.label("channel_id"),
            School.name.label("user_school"),
            func.count(Comment.id).label("comments_count"),
            func.count(PostLike.post_id).label("likes_count"),
            Post.view_count.label("views_count"),
            photo_url_subq.label("channel_photo_url"),
            Post.created_at.label("created_at")
        )
        .join(Channel, Post.channel_id == Channel.id)
        .join(User, Post.user_id == User.id)
        .join(School, User.school_id == School.id)
        .outerjoin(PostLike, Post.id == PostLike.post_id)
        .outerjoin(Comment, Post.id == Comment.post_id)
        .group_by(Post.id, Channel.channel_name, Channel.id, School.name, photo_url_subq,Post.view_count,Post.created_at)
        .order_by(Post.view_count.desc(), func.count(PostLike.post_id).desc())
        .offset(offset)
        .limit(limit)
        )
    
    results = query.all()
    posts_previews = []
    
    # Process each post row from the query.
    for row in results:
        post = row[0]
        channel_name = row.channel_name
        channel_id = row.channel_id
        user_school = row.user_school
        comments_count = row.comments_count
        likes_count = row.likes_count
        views_count = row.views_count
        channel_photo_url = row.channel_photo_url
        title = post.title or ""
        content_preview = post.content[:100] if post.content else ""
        time_since_post = get_time_since(post.created_at)
        
        posts_previews.append({
            "channel_name": channel_name,
            "channel_id": channel_id,
            "user_school": user_school,
            "title": title,
            "content_preview": content_preview,
            "channel_photo_url": channel_photo_url,
            "likes_count": likes_count,
            "comments_count": comments_count,
            "views_count": views_count,
            "time_since_post": time_since_post
        })
    
    return jsonify({
        "length": len(posts_previews),
        "posts_previews": posts_previews
    })
    

@app.route('/recent_followed_posts', methods=['GET'])
@cross_origin()#make this specific route CORS capable
def recent_followed_posts():
    # Retrieve required query string parameters
    user_id = request.args.get("user_id", type=str)
    if not user_id:
        return jsonify({"error": "Missing user_id parameter"}), 400

    offset = request.args.get("offset", default=0, type=int)
    limit = request.args.get("limit", default=10, type=int)

    # Define scalar subqueries for likes count, comments count, and channel photo URL:
    likes_count_subq = db.session.query(func.count(PostLike.user_id)) \
                          .filter(PostLike.post_id == Post.id) \
                          .correlate(Post).scalar_subquery()

    comments_count_subq = db.session.query(func.count(Comment.id)) \
                             .filter(Comment.post_id == Post.id) \
                             .correlate(Post).scalar_subquery()

    channel_photo_subq = db.session.query(Media.url) \
                          .filter(Media.channel_id == Channel.id, Media.media_type == 'photo') \
                          .order_by(Media.created_at.desc()) \
                          .limit(1).scalar_subquery()

    # Query posts from channels that the given user follows.
    # Join the necessary tables: Posts, Channels, Users, and (optionally) Schools.
    posts_query = (
        db.session.query(
            Post,
            Channel,
            User,
            School,
            likes_count_subq.label("likes_count"),
            comments_count_subq.label("comments_count"),
            channel_photo_subq.label("channel_photo_url")
        )
        .join(Channel, Channel.id == Post.channel_id)
        .join(User, User.id == Post.user_id)
        .outerjoin(School, School.id == User.school_id)
        .join(ChannelFollow, ChannelFollow.channel_id == Channel.id)
        .filter(ChannelFollow.user_id == user_id)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    posts_previews = []
    for post, channel, post_user, school, likes_count, comments_count, channel_photo_url in posts_query:
        # Generate the encoded channel name by replacing spaces with hyphens.
        channel_name = channel.channel_name
        encoded_channel_name = channel_name.replace(" ", "-")

        # Use the school name from the Schools table if available.
        user_school = school.name if school and hasattr(school, "name") else None

        # Use the post's title and create a preview for its content.
        title = post.title
        content_preview = (post.content[:85] + "...") if post.content and len(post.content) > 85 else post.content

        # Get the view count from the post record.
        views_count = post.view_count

        # Calculate the time elapsed since the post was created.
        time_since_post = get_time_since(post.created_at)

        posts_previews.append({
            "channel_name": channel_name,
            "channel_id": channel.id,
            "user_school": user_school,
            "title": title,
            "content_preview": content_preview,
            "channel_photo_url": channel_photo_url,
            "likes_count": likes_count,
            "comments_count": comments_count,
            "views_count": views_count,
            "time_since_post": time_since_post
        })

    response = {
        "length": len(posts_previews),
        "posts_previews": posts_previews
    }
    return jsonify(response), 200


@app.route('/sidbebar_info', methods=['GET'])
@cross_origin()#make this specific route CORS capable
def sidbebar_info():
    # Retrieve the required query parameter.
    user_id = request.args.get("user_id", type=str)
    if not user_id:
        return jsonify({"error": "Missing user_id parameter"}), 400

    # Get the user record.
    user = db.session.query(User).filter(User.id == user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Retrieve the school for the user.
    school = db.session.query(School).filter(School.id == user.school_id).first()
    if not school:
        return jsonify({"error": "User's school not found"}), 404

    # Obtain the school's main channel using main_channel_id from the Schools table.
    main_channel_id = school.main_channel_id
    if not main_channel_id:
        return jsonify({"error": "School does not have a main channel defined."}), 404

    main_channel = db.session.query(Channel).filter(Channel.id == main_channel_id).first()
    if not main_channel:
        return jsonify({"error": "Main channel not found."}), 404

    # Retrieve the school's main channel photo from Media (latest photo with media_type 'photo').
    school_channel_photo = (
        db.session.query(Media.url)
        .filter(Media.channel_id == main_channel.id, Media.media_type == 'photo')
        .order_by(Media.created_at.desc())
        .limit(1)
        .scalar()
    )

    # Query for other channels affiliated with the school, excluding the main channel.
    other_channels_query = (
        db.session.query(
            Channel,
            db.session.query(Media.url)
              .filter(Media.channel_id == Channel.id, Media.media_type == 'photo')
              .order_by(Media.created_at.desc())
              .limit(1)
              .scalar_subquery()
        )
        .join(ChannelFollow, ChannelFollow.channel_id == Channel.id)
        .filter(
            ChannelFollow.user_id == user_id
        )
        .filter(Channel.affiliated_school_id == None)
        .all()
    )

    other_channels = []
    for channel, channel_photo_url in other_channels_query:
        other_channels.append({
            "channel_name": channel.channel_name,
            "channel_id": channel.id,
            "channel_photo_url": channel_photo_url
        })

    # Build response object.
    response = {
        "school_channel_name": main_channel.channel_name,
        "school_channel_id": main_channel.id,
        "school_channel_photo": school_channel_photo,
        "other_channels": other_channels
    }
    return jsonify(response), 200

@app.route('/channel_info_for_user', methods=['GET'])
@cross_origin()#make this specific route CORS capable
def channel_info_for_user():
    # Retrieve query parameters: user_id and channel_id.
    user_id = request.args.get("user_id", type=str)
    channel_id = request.args.get("channel_id", type=str)
    if not user_id or not channel_id:
        return jsonify({"error": "Missing user_id or channel_id parameter"}), 400

    # Retrieve the channel record.
    channel = db.session.query(Channel).filter(Channel.id == channel_id).first()
    if not channel:
        return jsonify({"error": "Channel not found"}), 404

    # Check if the user follows this channel.
    is_followed = db.session.query(ChannelFollow).filter_by(user_id=user_id, channel_id=channel_id).first() is not None

    # Count the number of followers for this channel.
    follower_count = db.session.query(func.count(ChannelFollow.user_id)) \
                        .filter(ChannelFollow.channel_id == channel_id).scalar()

    # Get the most recent photo for the channel from the Media table.
    channel_photo = db.session.query(Media.url) \
                        .filter(Media.channel_id == channel_id, Media.media_type == 'photo') \
                        .order_by(Media.created_at.desc()) \
                        .limit(1).scalar()

    # Get the most recent banner for the channel from the Media table.
    channel_banner = db.session.query(Media.url) \
                        .filter(Media.channel_id == channel_id, Media.media_type == 'banner') \
                        .order_by(Media.created_at.desc()) \
                        .limit(1).scalar()

    # Build and return the response.
    response = {
        "is_followed": is_followed,
        "channel_name": channel.channel_name,
        "channel_id": channel.id,
        "channel_desc": channel.description,
        "is_private": channel.affiliated_school_id is not None,
        "follower_count": follower_count,
        "channel_photo": channel_photo,
        "channel_banner": channel_banner
    }
    return jsonify(response), 200

#channel_posts_for_user
@app.route('/channel_posts', methods=['GET'])
@cross_origin()#make this specific route CORS capable
def channel_posts():
    # Retrieve the required query parameter.
    user_id = request.args.get("user_id", type=str)
    print(user_id)
    channel_id = request.args.get("channel_id", type=str)
    print(request.args)
    print(channel_id)
    if not user_id or not channel_id:
        return jsonify({"error": "Missing user_id or channel_id parameter"}), 400
    
    # Retrieve offset from the query string (default = 0) and ensure it's an integer.
    offset = request.args.get('offset', default=0, type=int)
    limit = request.args.get('limit', default=10, type=int)

     # Build a subquery to fetch the school photo.
    # We assume "school_photo" comes from the main channel for the school.
    # For each school, we grab the main channel (the one with the lowest id) and get its latest
    # media record where media_type is 'photo'.
    school_photo_subq = (
        db.session.query(func.coalesce(Media.url, ""))
        .join(Channel, Media.channel_id == Channel.id)
        .filter(Channel.affiliated_school_id == School.id, Media.media_type == 'photo')
        .order_by(Media.created_at.desc())
        .limit(1)
        .scalar_subquery()
    )

    # check if user liked post
    user_like_subq = (
        db.session.query(func.count(PostLike.post_id))
        .filter(PostLike.user_id == user_id, PostLike.post_id == Post.id)
        .correlate(Post)
        .scalar_subquery()
    )

    user_liked = case((user_like_subq > 0, True), else_=False).label("user_like")

    # Build the main query:
    # Base selection: Post plus the aggregated columns and associated info.
    query = (
        db.session.query(
            Post,
            User.username.label("owner_username"),
            User.id.label("owner_id"),
            school_photo_subq.label("school_photo"),
            Post.title.label("title"),
            Post.content.label("content"),
            func.count((PostLike.post_id)).label("likes_count"),
            func.count((Comment.id)).label("comments_count"),
            Post.view_count.label("views_count"),
            Post.created_at.label("created_at"),
            user_liked
        )
        .join(User, Post.user_id == User.id)
        .join(School, User.school_id == School.id)
        .filter(Post.channel_id == channel_id)  # Only posts from the given channel.
        # Outer join for counting likes and comments.
        .outerjoin(PostLike, Post.id == PostLike.post_id)
        .outerjoin(Comment, Post.id == Comment.post_id)
        .group_by(
            Post.id,
            User.username,
            User.id,
            school_photo_subq,
            Post.title,
            Post.content,
            Post.view_count,
            Post.created_at,
            user_liked
        )
        .order_by(Post.created_at.desc())  # Order by recency.
        .offset(offset)
        .limit(limit)
    )
    
    results = query.all()
    posts_list = []
    
    for row in results:
        post = row[0]
        owner = {"username": row.owner_username, "id": row.owner_id}
        title = post.title or ""
        # Use the first 100 characters as a content preview.
        content_preview = (post.content or "")[:100]
        time_since_post = get_time_since(post.created_at)
        
        posts_list.append({
            "owner": owner,
            "school_photo": row.school_photo,
            "title": title,
            "content_preview": content_preview,
            "likes_count": row.likes_count,
            "comments_count": row.comments_count,
            "view_count": row.views_count,
            "time_since_post": time_since_post,
            "is_liked": row.user_like  # Boolean flag: True if the student liked the post.
        })
    
    return jsonify({"post": posts_list})

# School Main Channel ID
@app.route('/school_main_channel_id', methods=['GET'])
@cross_origin()  # Allow CORS for this route
def school_main_channel_id():
    user_id = request.args.get("user_id", type=str)
    
    if not user_id:
        return jsonify({"error": "Missing user_id parameter"}), 400

    # Retrieve user
    user = db.session.query(User).filter(User.id == user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Retrieve school
    school = db.session.query(School).filter(School.id == user.school_id).first()
    if not school:
        return jsonify({"error": "User's school not found"}), 404

    if not school.main_channel_id:
        return jsonify({"error": "School does not have a main channel assigned"}), 404

    return jsonify({"school_channel_id": str(school.main_channel_id)}), 200





if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=os.getenv('DEBUG'))