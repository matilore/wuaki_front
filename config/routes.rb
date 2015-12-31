Rails.application.routes.draw do
  
  resources :sessions
  resources :movies
  resources :series
  resources :all_medias
  resources :purchases
end
