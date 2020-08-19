Rails.application.routes.draw do
  resources :sessions, only: [:create]
  delete :logout, to: "sessions#lougout"
  get :logged_in, to: "sessions#logged_in"
  
  resources :polls, only: [:index, :new, :create, :edit, :update]

  get "/polls/closed", to: "polls#closed"
  get "/polls/check", to: "polls#check"
  root to: "static#home"
end
