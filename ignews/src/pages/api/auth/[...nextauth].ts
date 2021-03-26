import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query } from 'faunadb';
import { fauna } from '../../../services/fauna';
import getGitHubUserPrimaryEmail from '../../../utils/getGitHubUserPrimaryEmail';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user,user:email'
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  callbacks: {
    async signIn(user, account, profile) {

      try {
        const userToken = `${account.accessToken}`;

        const email = await getGitHubUserPrimaryEmail(userToken);

        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(email)
                )
              )
            ),
            query.Create(
              query.Collection('users'),
              { data: { email } }
            ),
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(email)
              )
            )
          )
        )

        return true;
      } catch {
        return false;
      }

    }
  }
})

