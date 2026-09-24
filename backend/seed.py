import datetime
from database import SessionLocal, engine, Base
from models import (
    CategoryModel,
    FundiModel,
    PortfolioItemModel,
    ReviewModel,
    BookingModel,
    UserModel,
    CommissionSettingsModel,
)

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Commission Settings
        commission = CommissionSettingsModel(
            id='default',
            rate_percent=15.0,
            updated_at=datetime.datetime.utcnow().isoformat()
        )
        db.add(commission)

        # 2. Categories
        categories = [
            CategoryModel(id='plumbing', name='Plumbing', icon='water-outline', description='Pipes, leak fixes, drainage, & bathroom fittings', active_count=42),
            CategoryModel(id='electrical', name='Electrical', icon='flash-outline', description='Wiring, generator setup, lighting, & socket repairs', active_count=38),
            CategoryModel(id='carpentry', name='Carpentry', icon='hammer-outline', description='Custom furniture, door repairs, cabinets, & woodworks', active_count=29),
            CategoryModel(id='painting', name='Painting', icon='color-palette-outline', description='Interior & exterior wall painting, wallpaper installation', active_count=31),
            CategoryModel(id='cleaning', name='Cleaning', icon='sparkles-outline', description='Deep home cleaning, carpet washing, & sofa care', active_count=56),
            CategoryModel(id='masonry', name='Masonry', icon='construct-outline', description='Brickwork, tiling, paving, & foundation structural repairs', active_count=24),
            CategoryModel(id='welding', name='Welding', icon='flame-outline', description='Metal gates, window grills, steel fabrication, & repairs', active_count=19),
            CategoryModel(id='mechanics', name='Mechanics', icon='car-sport-outline', description='Engine diagnostic, oil change, brakes, & roadside assistance', active_count=35),
            CategoryModel(id='appliance_repair', name='Appliance Repair', icon='hardware-chip-outline', description='Fridges, washing machines, microwaves, & AC units', active_count=27),
        ]
        db.add_all(categories)

        # 3. Fundis (Using SVG Initials Avatars)
        fundis = [
            FundiModel(
                id='f1',
                name='John Mboya',
                avatar='https://ui-avatars.com/api/?name=John+Mboya&background=081E45&color=FF7A00&bold=true',
                cover_image='https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
                category='Plumbing',
                category_id='plumbing',
                rating=4.9,
                review_count=128,
                experience_years=8,
                completed_jobs=340,
                hourly_rate=1500,
                estimated_price=2500,
                distance_km=1.8,
                location_name='Westlands, Nairobi',
                is_verified=True,
                is_available=True,
                is_popular=True,
                bio='Certified Master Plumber with over 8 years experience fixing high-pressure pipes, solar water heaters, and modern bathroom installations. Quick response time with guaranteed quality.',
                phone='+254712345678',
                skills=['High Pressure Pipes', 'Solar Water Heaters', 'Drainage Systems', 'Leak Detection', 'Bathroom Renovations']
            ),
            FundiModel(
                id='f2',
                name='Samuel Waweru',
                avatar='https://ui-avatars.com/api/?name=Samuel+Waweru&background=081E45&color=FF7A00&bold=true',
                cover_image='https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
                category='Electrical',
                category_id='electrical',
                rating=4.85,
                review_count=94,
                experience_years=6,
                completed_jobs=215,
                hourly_rate=1800,
                estimated_price=3000,
                distance_km=2.4,
                location_name='Kilimani, Nairobi',
                is_verified=True,
                is_available=True,
                is_popular=True,
                bio='Licensed Senior Electrician specializing in commercial wiring, emergency power generator cutover switches, smart home automation, and circuit troubleshooting.',
                phone='+254722987654',
                skills=['Full House Rewiring', 'Circuit Breakers', 'Backup Generator Setup', 'LED Lighting Design', 'Surge Protection']
            ),
            FundiModel(
                id='f3',
                name='Peter Kariuki',
                avatar='https://ui-avatars.com/api/?name=Peter+Kariuki&background=081E45&color=FF7A00&bold=true',
                cover_image='https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
                category='Carpentry',
                category_id='carpentry',
                rating=4.92,
                review_count=160,
                experience_years=10,
                completed_jobs=410,
                hourly_rate=1400,
                estimated_price=4500,
                distance_km=3.1,
                location_name='Lavington, Nairobi',
                is_verified=True,
                is_available=True,
                is_popular=True,
                bio='Artisan Woodworker and Carpenter. Crafting bespoke hardwood wardrobes, fitted kitchens, timber pergola structures, and door repairs.',
                phone='+254733112233',
                skills=['Bespoke Cabinets', 'Hardwood Tables', 'Door & Window Frames', 'Kitchen Fittings', 'Wood Restoration']
            ),
            FundiModel(
                id='f4',
                name='Grace Wanjiru',
                avatar='https://ui-avatars.com/api/?name=Grace+Wanjiru&background=081E45&color=FF7A00&bold=true',
                cover_image='https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
                category='Painting',
                category_id='painting',
                rating=4.88,
                review_count=76,
                experience_years=5,
                completed_jobs=180,
                hourly_rate=1200,
                estimated_price=3500,
                distance_km=0.9,
                location_name='Parklands, Nairobi',
                is_verified=True,
                is_available=True,
                is_popular=False,
                bio='Detail-oriented professional interior decorator & painter. Specialized in textured wall finishes, damp-proof coatings, and premium color blending.',
                phone='+254744556677',
                skills=['Textured Finishes', 'Damp-Proofing', 'Interior Styling', 'Exterior Weather Guard', 'Stencil Art']
            ),
            FundiModel(
                id='f5',
                name='Joseph Otieno',
                avatar='https://ui-avatars.com/api/?name=Joseph+Otieno&background=081E45&color=FF7A00&bold=true',
                cover_image='https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
                category='Cleaning',
                category_id='cleaning',
                rating=4.95,
                review_count=210,
                experience_years=7,
                completed_jobs=520,
                hourly_rate=1000,
                estimated_price=2000,
                distance_km=1.2,
                location_name='Kitisuru, Nairobi',
                is_verified=True,
                is_available=True,
                is_popular=True,
                bio='Founder of Sparkle Pro Cleaners. Providing eco-friendly deep house cleaning, post-construction cleanup, fabric sofa steam washing, and carpet sanitization.',
                phone='+254755667788',
                skills=['Deep Home Cleaning', 'Sofa Steam Clean', 'Carpet Shampooing', 'Move-in/Move-out', 'Window Washing']
            )
        ]
        db.add_all(fundis)

        # 4. Portfolio Items
        portfolio_items = [
            PortfolioItemModel(id='p1', fundi_id='f1', title='Modern Bathroom Plumbing Installation', image_url='https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', category='Plumbing'),
            PortfolioItemModel(id='p2', fundi_id='f1', title='Solar Water Heater Setup', image_url='https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=80', category='Plumbing'),
            PortfolioItemModel(id='p4', fundi_id='f2', title='Modern LED Recessed Ceiling Lighting', image_url='https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', category='Electrical'),
        ]
        db.add_all(portfolio_items)

        # 5. Reviews (Using SVG Initials Avatars)
        reviews = [
            ReviewModel(id='r1', fundi_id='f1', user_name='Sarah Jenkins', user_avatar='https://ui-avatars.com/api/?name=Sarah+Jenkins&background=E2E8F0&color=081E45&bold=true', rating=5.0, date='Yesterday', comment='John arrived within 25 minutes of booking! He solved a stubborn leak in my apartment kitchen in less than an hour. Highly recommended.'),
            ReviewModel(id='r2', fundi_id='f1', user_name='David Ochieng', user_avatar='https://ui-avatars.com/api/?name=David+Ochieng&background=E2E8F0&color=081E45&bold=true', rating=4.8, date='3 days ago', comment='Very polite, professional, and neat. Left the workspace spotless after replacing the main water pipe valve.'),
            ReviewModel(id='r3', fundi_id='f2', user_name='Amina Mohamed', user_avatar='https://ui-avatars.com/api/?name=Amina+Mohamed&background=E2E8F0&color=081E45&bold=true', rating=5.0, date='1 week ago', comment='Samuel saved our restaurant during a sudden breaker trip before weekend dinner hours. Excellent master electrician!'),
        ]
        db.add_all(reviews)

        # 6. Users (Client, Fundi, Owner)
        users = [
            UserModel(
                id='u1',
                name='Alex Kariuki',
                email='alex.kariuki@example.com',
                phone='+254 711 223 344',
                avatar='https://ui-avatars.com/api/?name=Alex+Kariuki&background=081E45&color=FF7A00&bold=true',
                address='Westlands, Nairobi, Kenya',
                hashed_password='password',
                role='client'
            ),
            UserModel(
                id='u_fundi_1',
                name='John Mboya',
                email='john.mboya@patafundi.com',
                phone='+254712345678',
                avatar='https://ui-avatars.com/api/?name=John+Mboya&background=081E45&color=FF7A00&bold=true',
                address='Westlands, Nairobi',
                hashed_password='password',
                role='fundi',
                fundi_id='f1'
            ),
            UserModel(
                id='u_owner_1',
                name='PataFundi Owner',
                email='owner@patafundi.com',
                phone='+254 700 111 222',
                avatar='https://ui-avatars.com/api/?name=Owner+Admin&background=FF7A00&color=081E45&bold=true',
                address='Headquarters, Nairobi',
                hashed_password='password',
                role='owner'
            )
        ]
        db.add_all(users)

        # 7. Bookings with Commission Calculations (15% platform fee)
        bookings = [
            BookingModel(
                id='BK-9021',
                fundi_id='f1',
                fundi_name='John Mboya',
                fundi_avatar='https://ui-avatars.com/api/?name=John+Mboya&background=081E45&color=FF7A00&bold=true',
                fundi_category='Plumbing',
                fundi_phone='+254712345678',
                date='2026-08-10',
                time_slot='10:00 AM - 12:00 PM',
                address='Apartment 4B, Westwood Heights, Westlands',
                description='Master bathroom shower mixer leaking continuously into tile floor.',
                payment_method='mpesa',
                amount=2500,
                commission_rate=15.0,
                commission_amount=375,
                fundi_earnings=2125,
                status='confirmed',
                created_at='2026-08-06T14:20:00Z'
            ),
            BookingModel(
                id='BK-8419',
                fundi_id='f5',
                fundi_name='Joseph Otieno',
                fundi_avatar='https://ui-avatars.com/api/?name=Joseph+Otieno&background=081E45&color=FF7A00&bold=true',
                fundi_category='Cleaning',
                fundi_phone='+254755667788',
                date='2026-08-02',
                time_slot='02:00 PM - 05:00 PM',
                address='Villa 12, Rosewood Estate, Lavington',
                description='Deep carpet shampoo cleaning for 3 bedroom house.',
                payment_method='card',
                amount=4000,
                commission_rate=15.0,
                commission_amount=600,
                fundi_earnings=3400,
                status='completed',
                created_at='2026-08-01T09:15:00Z'
            )
        ]
        db.add_all(bookings)

        db.commit()
        print("Database successfully seeded with SVG avatars, commission settings, and roles!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
