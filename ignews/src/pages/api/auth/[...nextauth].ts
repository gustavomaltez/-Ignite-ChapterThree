import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query } from 'faunadb';
import { fauna } from '../../../services/fauna';
import getGitHubUserPrimaryEmail from '../../../utils/getGitHubUserPrimaryEmail';
import { session } from 'next-auth/client';

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
    async session(session) {

      try {
        const userActiveSubscription = await fauna.query(
          query.Get(
            query.Intersection([
              query.Match(
                query.Index('subscription_by_user_ref'),
                query.Select(
                  "ref",
                  query.Get(
                    query.Match(
                      query.Index('user_by_email'),
                      query.Casefold(session.user.email)
                    )
                  )
                )
              ),
              query.Match(
                query.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        };
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        };
      }

    },
    async signIn(user, account, profile) {

      try {
        const userToken = `${account.accessToken}`;

        const email = await getGitHubUserPrimaryEmail(userToken);
        user.email = email;

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

