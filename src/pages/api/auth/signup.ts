import {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'

// CORS 미들웨어 설정
const cors = Cors({
  origin: '*', // 모든 도메인 허용 (*), 또는 특정 도메인 ('https://example.com')
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})

// CORS 미들웨어를 Next.js API 라우트에 적용하는 함수
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)

  if (req.method === 'POST') {
    // 회원가입 처리 로직
    const {email, name, password} = req.body
    // DB에 저장하는 로직 등
    return res.status(201).json({message: 'User created'})
  } else {
    res.status(405).json({message: 'Method not allowed'})
  }
}
