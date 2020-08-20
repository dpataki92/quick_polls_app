Rails.application.routes.draw do
  resources :sessions, only: [:create]
  delete "sessions/logout", to: "sessions#logout"
  get "sessions/logged_in", to: "sessions#logged_in"
  
  resources :polls, only: [:index, :new, :create, :edit, :update]

  get "/polls/closed", to: "polls#closed"
  get "/polls/check", to: "polls#check"
  root to: "static#home"
end
