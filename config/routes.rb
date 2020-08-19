Rails.application.routes.draw do
  resources :sessions, only: [:create]
  resources :registrations, only: [:create]
  delete :logout, to: "sessions#lougout"
  get :logged_in, to: "sessions#logged_in"
  root to: "static#home"
end
