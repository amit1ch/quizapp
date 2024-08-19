const z = require("zod");


    const RegisterUserSchema = z.object({
    username: z.string().min(1,"This field is required"),
    name:z.string().min(1,"this field is required"),
    password: z.string().min(8,"this field is required"),
    confirmpassword : z.string().min(8,"This is field is required"),
    email: z.string().min(1,"this is required").email("this is a valid email")

}
)

const loginUserSchema = z.object({
  password: z.string().min(8,"this field is required"),
  email: z.string().min(1,"this is required").email("this is a valid email")

}
)

const CreateQuizSchema =  z.object({
  title:z.string({required_error:"This Field is required"}).min(1,"this field is required"),

  description:z.string({required_error:"This Field is required"}).min(1,"this field is required"),

  tag:z.array(z.string({required_error:"This Field is required"}).min(1,"this field is required")), 

  level:z.string({required_error:"This Field is required"}).min(1,"this field is required"),

  category: z.array(z.string({required_error:"This Field is required"}).min(1,"this field is required")),

  questions:z.array(
    z.object({
    
    question : z.string({required_error:"this field is required"}),
    
    answerOptions : z.array(
      z.string({required_error:"This field is required"})
    ),

    correctAnswer : z.string({required_error:"This field is required"}),
     
    
    })
  )



})

const checkQuizSchema = z.object({
  quizId:z.string({required_error:"This field is required"}),
  answer:z.array(z.string({required_error:"THis field is required"}))
  
})

module.exports = {RegisterUserSchema,loginUserSchema,CreateQuizSchema ,checkQuizSchema}