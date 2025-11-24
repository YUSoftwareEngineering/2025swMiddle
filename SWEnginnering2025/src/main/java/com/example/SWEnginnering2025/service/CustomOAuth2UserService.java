/*
    Project: CustomOAuth2UserService.java : 소셜 로그인 처리

    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google, naver, kakao ...
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // OAuth2 정보를 mapping (provider마다 다름)
        String socialId = oAuth2User.getName();
        String email = (String) oAuth2User.getAttributes().get("email");
        String name = (String) oAuth2User.getAttributes().get("name");

        User user = userRepository.findByProviderAndProviderId(registrationId, socialId)
                .map(entity -> updateExistingUser(entity, name))
                .orElseGet(() -> saveNewUser(registrationId, socialId, email, name));

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                userNameAttributeName
        );
    }

    // DB에 사용자 정보가 없는 경우 저장
    private User saveNewUser(String provider, String providerId, String email, String name) {
        User newUser = new User();
        newUser.setProvider(provider);
        newUser.setProviderId(providerId);
        newUser.setEmail(email);
        newUser.setName(name);
        // 소셜 가입 시 임시 필드 설정
        // userId, password는 필수로 입력되어야 해서 dummy 설정
        newUser.setUserId(email.split("@")[0] + "_" + provider.substring(0,2));
        newUser.setPassword("DUMMY_OAUTH_PASS");
        return userRepository.save(newUser);
    }

    // 이미 DB에 있는 경우 이름만 업데이트
    private User updateExistingUser(User user, String name) {
        user.setName(name);
        return userRepository.save(user);
    }
}