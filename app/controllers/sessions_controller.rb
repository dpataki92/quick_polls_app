class SessionsController < ApplicationController
    include CurrentUserConcern
    before_action :accept_all_params


    def create
        
        user = User.find_by(username: params[:username])
        if user
            
            if user.try(:authenticate, params[:password])
            session[:user_id] = user.id
            binding.pry
            render json: {
                status: :created,
                logged_in: true,
                user: user.username
            }
            else
                render json: { message: "Sorry, this username is taken or you used a wrong password :(", logged_in: false }
            end
        else
            user = User.create!(username: params[:username], password: params[:password])
            if user
                session[:user_id] = user.id
                binding.pry
                render json: {
                    status: :created,
                    logged_in: true,
                    user: user.username
                }
            else
                render json: { message: "Sorry, data validation failed :(", logged_in: false }
            end
        end
    end

    def logged_in
        binding.pry
        if @current_user
            render json: {
                logged_in: true,
                user: @current_user.username
            }
        else
            render json: {
                logged_in: false
            }
        end
    end

    def logout
        binding.pry
        reset_session
        render json: { status: 200, logged_out: true}
    end

    private

    def accept_all_params
        params.permit!
    end
end