import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const userData  = defineStore('userData', () => {
    let username = ref('')
    let email = ref('')
    let password = ref('')
    let role = ref('')
    let token = ref('')
    let userId = ref(1)


    function setUserData(user) {
        username.value = user.username
        email.value = user.email
        password.value = user.password
        role.value = user.role
        token.value = user.token
        userId.value = user.userId
    }
    function clearUserData() {
        username.value = ''
        email.value = ''
        password.value = ''
        role.value = ''
        token.value = ''
        userId.value = 1
    }
    function getUsername() {
        return username.value
    }
    function getEmail() {
        return email.value
    }
    function getPassword() {
        return password.value
    }
    function getRole() {
        return role.value
    }
    function getToken() {
        return token.value
    }
    function getUserId() {
        return userId.value
    }
    function setUsername(username) {
        username.value = username
        
    }
    function setEmail(email) {
        email.value = email
        
    }
    function setPassword(password) {
        password.value = password
        
    }
    function setRole(role) {
        role.value = role
        
    }
    function setToken(token) {
        token.value = token
        
    }
    function setUserId(userId) {
        userId.value = userId
        
    }
    return { username, email, password, role, token, userId, setUserData, clearUserData, getUsername, getEmail, getPassword, getRole, getToken, getUserId, setUsername, setEmail, setPassword, setRole, setToken, setUserId }

  })
  