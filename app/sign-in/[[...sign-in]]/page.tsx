import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '900',
          color: '#00B894',
          marginBottom: '8px',
        }}>
          ● provn
        </div>
        <p style={{
          color: '#636E72',
          fontSize: '14px',
          margin: 0,
        }}>
          Agent portal — sign in to manage your profile
        </p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: { width: '100%', maxWidth: '400px' },
            card: {
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              borderRadius: '16px',
              border: '1px solid #B2F5EA',
            },
            headerTitle: { color: '#2D3436' },
            headerSubtitle: { color: '#636E72' },
            formButtonPrimary: {
              backgroundColor: '#00B894',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
            },
            footerActionLink: { color: '#00B894' },
          },
        }}
      />
    </div>
  )
}
