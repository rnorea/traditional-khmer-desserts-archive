import { cookies } from 'next/headers';
import ReviewPage from '../[lang]/review/page.js';

export default async function Page() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const lang = (langCookie === 'kh') ? 'kh' : 'en';

  return <ReviewPage params={Promise.resolve({ lang })} />;
}
