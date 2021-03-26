
interface GitHubUserEmail {
    email: string,
    primary: boolean,
    verified: boolean,
    visibility: string | null
}

export default async function (accessToken: string): Promise<string> {
    const responseGetUserEmails = await fetch('https://api.github.com/user/emails', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })

    const userEmails = await responseGetUserEmails.json();

    const { email } = userEmails.find((email: GitHubUserEmail) => email.primary);

    return email;
}