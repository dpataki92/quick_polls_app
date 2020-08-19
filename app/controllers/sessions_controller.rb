class SessionsController < ApplicationController
    include CurrentUserConcern

    def create
        user = User.find_by(username: params[:user][:username])

        if user
            if user.try(:authenticate, params[:user][:password])
            session[:user_id] = user.id
            render json: {
                status: :created,
                logged_in: true,
                user: user
            }
            else
                render json: { message: "Sorry, this username is taken or you used a wrong password :(" }
            end
        else
            user = User.create!(username: params[:user][:username], password: params[:user][:password])

            if user
                session[:user_id] = user.id
                render json: {
                    status: :created,
                    logged_in: true,
                    user: user
                }
            else
                render json: { message: "Sorry, data validation failed :(" }
            end
        end
    end

    def logged_in
        if @current_user
            render json: {
                logged_in: true,
                user: @current_user
            }
        else 
            render json: {
                logged_in: false
            }
        end
    end
end