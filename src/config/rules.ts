export const authRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]{1,32}$/,
      message: '用户名必须是 1-32位 的字符，只能包含字母数字下划线',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]{6,32}$/,
      message: '密码必须是 6-32位 的字符，只能包含字母数字下划线',
      trigger: 'blur'
    }
  ]
}
