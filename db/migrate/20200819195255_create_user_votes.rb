class CreateUserVotes < ActiveRecord::Migration[6.0]
  def change
    create_table :user_votes do |t|
      t.integer :option_id
      t.integer :user_id
      t.integer :poll_id
    end
  end
end
