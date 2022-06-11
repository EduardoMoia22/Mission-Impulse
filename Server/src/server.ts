import express from 'express';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5bb731fe0dbfe4",
    pass: "87094ee1f97289"
  }
});

app.post("/feedbacks", async(req, res) =>{
  const { type, comment, screenshot} = req.body;
  
  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot, 
    }
  });

  await transport.sendMail({
    from: 'Equipe Suna <oi@suna.com>',
    to: 'Eduardo Móia <eduardomoiadossantos@gmail.com>',
    subject: 'Novo Feedback',
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; colo: #111;">`,
      `<p>Tipo de feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`
    ].join('\n')
  });

   return res.status(201).json({ data: feedback });
});

app.listen(3333, () => {
  console.log("listening");
});

