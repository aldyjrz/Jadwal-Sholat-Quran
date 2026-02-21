import fs from 'fs'
import path from 'path'

export async function GET() {
    const filePath = path.join(process.cwd(), 'data/settings.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    return Response.json(JSON.parse(data))
}

export async function POST(req) {
    const body = await req.json()
    const filePath = path.join(process.cwd(), 'data/settings.json')
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2))
    return Response.json({ success: true })
}