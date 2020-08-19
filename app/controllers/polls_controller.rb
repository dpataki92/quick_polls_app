class PollsController < ApplicationController
    include CurrentUserConcern

    def index
        polls = @current_user.polls.pending_polls
        render json: PollSerializer.new(polls).to_serialized_json
    end

end