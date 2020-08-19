class User < ApplicationRecord 
    has_secure_password

    has_many :user_polls
    has_many :polls, through: :user_polls

    has_and_belongs_to_many :friends,
                          :class_name => "User",
                          :join_table => "user_friends",
                          :foreign_key => "user_id",
                          :association_foreign_key => "friend_id"

    
    has_many :options, through: :polls
    has_many :votes

    validates :username, presence: true
    
end