$ = document.querySelector.bind(document);

      var token = localStorage.getItem('accessToken');
        if (token) {
          showLoggedIn();
        }
      
      var idToken = localStorage.getItem('id_token') || null;
      var profile = JSON.parse(localStorage.getItem('profile')) || null;
      if (idToken && profile) {
        $('.avatar').src = profile.picture;
        $('.name').textContent = profile.nickname;
        $('.email').textContent = profile.email;
        $('.profile-section').classList.remove('hidden');
        $('.btn-login').classList.add('hidden');
        $('.btn-logout').classList.remove('hidden');
      } else {
        $('.profile-section').classList.add('hidden');
        $('.btn-login').classList.remove('hidden');
        $('.btn-logout').classList.add('hidden');
      }
      $('.btn-login').addEventListener('click', function() {
        lock.show();

      });

      lock.on('authenticated', (authResult) => {
        localStorage.setItem('id_token', authResult.idToken);
        lock.getProfile(authResult.idToken, (err, profile) => {
          location.href = "concentrado.html";
          localStorage.setItem('profile', JSON.stringify(profile));
          $('.profile-section').classList.remove('hidden');
          $('.avatar').src = profile.picture;
          $('.name').textContent = profile.nickname;
          $('.email').textContent = profile.email;
          $('.btn-login').classList.add('hidden');
          $('.btn-logout').classList.remove('hidden');
        });
        lock.hide();
      });

      lock.on('authorization_error', function(error) {
        lock.show({
          flashMessage: {
            type: 'error',
            text: error.error_description
          }
        });
      });
      
      $('.btn-logout').addEventListener('click', function() {
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
        $('.profile-section').classList.add('hidden');
        $('.avatar').src = '';
        $('.name').textContent = null;
        $('.email').textContent = null;
        $('.btn-login').classList.remove('hidden');
        $('.btn-logout').classList.add('hidden');
      });