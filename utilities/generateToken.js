import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '50d' })

}

export default generateToken


//avishek's token- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA3MDQ5MmMzNTI2MTRmMjdjM2ZiYyIsImlhdCI6MTcyNDkzNjI2OCwiZXhwIjoxNzI5MjU2MjY4fQ.9qfYuxjOPxau2I4WfVtjpSlEey9a-fqcJUBlN0Qz4NI