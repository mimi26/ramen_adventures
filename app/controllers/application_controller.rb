class ApplicationController < ActionController::Base
    include Pundit
    protect_from_forgery with: :null_session
    rescue_from NotFoundException, :with => :not_found

    def not_found
        respond_to do |format|
            format.html { render :file => File.join(Rails.root, 'public', 'index.html')}
            format.json { render :json => { error: "not found" } }
        end
    end
end
