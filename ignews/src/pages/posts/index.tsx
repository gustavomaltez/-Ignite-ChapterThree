import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import Prismic from '@prismicio/client';

export default function Posts(){
    return (
        <>
            <Head>
                <title>Posts  | IGnews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="#">
                        <time>12 de março de 2021</time>
                        <strong>Authentication in Next.js: Building an auth API with NextAuth.js</strong>
                        <p>Authentication is the act of proving that someone is who they say they are — confirming the identity of a user in an application, for example. In this tutorial...</p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2021</time>
                        <strong>Authentication in Next.js: Building an auth API with NextAuth.js</strong>
                        <p>Authentication is the act of proving that someone is who they say they are — confirming the identity of a user in an application, for example. In this tutorial...</p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2021</time>
                        <strong>Authentication in Next.js: Building an auth API with NextAuth.js</strong>
                        <p>Authentication is the act of proving that someone is who they say they are — confirming the identity of a user in an application, for example. In this tutorial...</p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2021</time>
                        <strong>Authentication in Next.js: Building an auth API with NextAuth.js</strong>
                        <p>Authentication is the act of proving that someone is who they say they are — confirming the identity of a user in an application, for example. In this tutorial...</p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2021</time>
                        <strong>Authentication in Next.js: Building an auth API with NextAuth.js</strong>
                        <p>Authentication is the act of proving that someone is who they say they are — confirming the identity of a user in an application, for example. In this tutorial...</p>
                    </a>
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {

    const prismic = getPrismicClient();

    const response = await prismic.query(
        [Prismic.predicates.at('document.type', 'post')],
        {
            fetch: ['publication.title','publication.content'],
            pageSize: 100
        }
    )

    console.log(response);
    return {
        props: {

        }
    }
}