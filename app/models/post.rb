class Post < ApplicationRecord
    has_many :comments, dependent: :destroy
    belongs_to :shop
end
