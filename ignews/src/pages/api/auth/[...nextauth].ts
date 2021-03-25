import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query } from 'faunadb';
import { fauna } from '../../../services/fauna';

interface GitHubUserEmail {
  email: string,
  primary: boolean,
  verified: boolean,
  visibility: string | null
}

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user,user:email'
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {

      const responseGetUserEmails = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
        }
      })

      const userEmails = await responseGetUserEmails.json();

      const { email } = userEmails.find((email: GitHubUserEmail) => email.primary)

      await fauna.query(
        query.Create(
          query.Collection('users'),
          {
            data: { email }
          }
        )
      )
      return true;
    }
  }
})