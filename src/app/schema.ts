export enum DATA_TYPE {
    CUSTOM_PAGE_DATA = "custom_page_data",
    SYSTEM_DATA = "system_data",
    ADMIN_DATA = "admin_data",
    USER_DATA = 'user_data',
    CAR_DATA = 'car_data',
    BLOCKING_DATA = 'blocking_data',
    PARKING_DATA = 'parking_data',
    ORDER_DATA = 'order_data',
    TEMP_ORDER_DATA = 'temp_order_data',
    EQUIPMENT_DATA = 'equipment_data',
    PRODUCT_DATA = 'product_data',
    CAMPAIGN_DATA = 'campaign_data',
    PAYMENT_DATA = 'payment_data',
    COUPON_DATA = 'coupon_data',
    DEPOSIT_DATA = 'deposit_data',
    FACTORY_DATA = 'factory_data',
    MAINTENANCE_DATA = 'maintenance_data',
    MAINTENANCE_CATEGORY_DATA = 'maintenance_category_data',
    APPOINTMENT_DATA = 'appointment_data',
    GIFT_DATA = 'gift_data',
    EMERGENCY_DATA = 'emergency_data',
    VIOLATION_DATA = 'violation_data',
    NOTIFICATION_DATA = 'notification_data',
    NOTIFICATION_TEMPLATE_DATA = 'notification_template_data',
    RBB_DATA = 'rbb_data',
    RBB_PAYMENT_DATA = 'rbb_payment_data',
    RBB_EQUIPMENT_DATA = 'rbb_equipment_data',
    PLATE_DATA = 'plate_data',
    FAQ_DATA = 'faq_data',
    ADMIN_NOTIFICATION_DATA = 'admin_notification_data',
    LOG_DATA = 'log_data',
    SEVEN_COUPON_DATA = 'seven_coupon_data',
    NEW_FORM_DATA = 'new_form_data',
    COMPENSATION_PAYMENT_DATA = 'compensation_payment_data',
    CAR_VIEWING_DATA = 'car_viewing_data',
    SMART_CAR_DATA = 'smart_car_data',
    VEHICLE_RENTAL_AGREEMENT_DATA = 'vehicle_rental_agreement_data',
    RETURN_VEHICLE_REPORT_DATA = 'return_vehicle_report_data',
    CHARGE_DATA = 'charge_data',
    PRERENT_CAR_DATA = 'prerent_car_data',
    PRERENT_ORDER_DATA = 'prerent_order_data',
    AIRWALLEX_TOKEN_DATA = 'airwallex_token_data',
    BNB_CHECKER_QUEUE_DATA = 'bnb_checker_queue_data',
    TESLA_TOKEN_DATA = 'tesla_token_data',
    OCCUPANCY_RECORD_DATA = 'occupancy_record_data',
    INSPECTION_DATA = 'inspection_data',
    CREDIT_CARD_FAILURE_DATA = 'credit_card_failure_data'
}

export interface SystemData {
    id: number;
    data_type: DATA_TYPE.SYSTEM_DATA;
    create_date: Date | string;
    disabled: Boolean;
    admin_email_list: string[];
    android_bundle_id: string;
    android_latest_version: string;
    android_latest_version_end_point: AppUpdateEndpoint;
    app_store: string;
    bank_transfer_info: string;
    fps_info: string;
    banner: Banner[];
    company_address: string;
    company_closing_time: string;
    company_email: string;
    company_latitude: number;
    company_longitude: number;
    company_name: string;
    company_opening_time: string;
    company_phone: string;
    company_whatsapp: string;
    email_dev: Boolean;
    enable_sms: Boolean;
    enable_inapp_notification: Boolean;
    ending_hour_to_allow_return: number;
    favorite_car_id: number;
    google_store: string;
    hong_kong_island_custom_pick_up_charge: number;
    ios_bundle_id: string;
    ios_latest_version: string;
    ios_latest_version_end_point: AppUpdateEndpoint;
    kowloon_custom_pick_up_charge: number;
    maintaining: Boolean;
    maximum_appointment_day_in_advance: number;
    maximum_booking_month_in_advance: number;
    maximum_pick_time_to_allow_another_return: string;
    maximum_return_time_to_allow_another_pickup: string;
    minimum_appointment_day_in_advance: number;
    minimun_hour_interval_between_pickup_return: number;
    minimum_booking_days_to_allow_parking_reservation: number;
    new_territories_custom_pick_up_charge: number;
    penalty_percentage: number;
    privacy_policy: string;
    referral_coupon_amount: number;
    referral_coupon_type: string;
    sms_exclusive_phone_list: string[];
    credit_card_exclusive_user_id_list: number[];
    starting_hour_to_allow_pickup: number;
    stripe_dev_key: string;
    stripe_prod_key: string;
    terms_and_conditions: string;
    tester_email_list: string[];
    tinypng_compression: Boolean;
    tinypng_key: string;
    towing_service_phone: string;
    towing_service_phone2: string;
    maximum_hours_to_settle_compensation_payment: number;
    minimum_car_viewing_day_in_advance: number;
    maximum_car_viewing_day_in_advance: number;
    minimun_hour_interval_between_pickup_return_for_car_viewing: number;
    minimum_car_viewing_time: string;
    maximum_car_viewing_time: string;
}

export interface Banner {
    link_to: '' | 'static_page' | 'url' | 'car' | 'custom_page';
    static_page_url: string;
    url: string;
    car_id: number | null;
    car_model: string;
    custom_page_id: number | null;
    extra_data: Object | null;
    img: string;
    app_page_display_list: AppPage[]
}

export enum AppUpdateEndpoint {
    store = "store",
    server = "server"
}

export enum AppPage {
    home = "home",
}

export interface AdminData {
    id: number;
    data_type: DATA_TYPE.ADMIN_DATA;
    create_date: Date | string;
    disabled: Boolean;
    username: string;
    couchbase_username: string;
    email: string;
    phone: string;
    password_data: string;
    last_update_datetime: Date | string;
    icon_url: string;
    authority_list: Authority[];
    type: AdminType;
    notification_id: string;
    device_id: String;
    device_info: DeviceInfo;
    owner_car_id_list: number[];
}

export enum AdminType {
    admin = "admin",
    sales = "sales",
    maintainer = "maintainer",
    buyer = "buyer",
    patrol = "patrol",
    owner = "owner",
    pickup_dropoff = "pickup_dropoff",
}

export enum Authority {
    credit_rating = "credit_rating",
    offer_discount = "offer_discount",
    dashcam_function = "dashcam_function",
    obd_control = "obd_control",
}
export interface UserData {
    id: number;
    data_type: DATA_TYPE.USER_DATA;
    create_date: Date | string;
    disabled: Boolean;
    username: string;
    email: string;
    phone: string;
    call: "Mr." | "Miss" | "Company";
    referrer_code: string;
    referral_code: string;
    verify_code: string;
    request_datetime: Date | string;
    notification_id: string;
    zh_company_name: string;
    en_company_name: string;
    zh_full_name: string;
    en_full_name: string;
    identity_number: string;
    br_number: string;
    date_of_birth: string;
    address: string;
    br_url: string;
    identity_card_url: string;
    driving_license_url: string;
    address_proof_url: string;
    income_certificate_url: string;
    suspension_record: Boolean;
    penalty_record: Boolean;
    bankrupt_record: Boolean;
    two_year_driving_experience: Boolean;
    dangerous_driving_record: Boolean;
    drug_driving_record: Boolean;
    other_doc_url_list: DocObject[];
    favorite_car_model_list: FavoriteCarModel[];
    credit_rating: string;
    credit_doc_url_list: string[];
    preference: Preference;
    device_id: String;
    device_info: DeviceInfo;
    profile_img_url: string;
    opt_in: boolean;
    opt_out: boolean;
    auto_charge_stripe_payment_method_id: string;
    auto_charge_adyen_payment_method_id: string;
    bypass_face_matching: boolean;
}

export interface FavoriteCarModel {
    car_id: number;
    create_date: Date | string;
    model: string;
}

export interface DeviceInfo {
    name?: string;
    model: string;
    platform: 'ios' | 'android' | 'web';
    operatingSystem: 'ios' | 'android' | 'windows' | 'mac' | 'unknown';
    osVersion: string;
    iOSVersion?: number;
    androidSDKVersion?: number;
    manufacturer: string;
    isVirtual: boolean;
    memUsed?: number;
    diskFree?: number;
    diskTotal?: number;
    realDiskFree?: number;
    realDiskTotal?: number;
    webViewVersion: string;
}

export interface Preference {
    living_area: Area;
    living_distinct: HongKongDistinct | KowloonDistinct | NewTerritoriesDistinct;
    working_area: Area;
    working_distinct: HongKongDistinct | KowloonDistinct | NewTerritoriesDistinct;
    car_renting_purpose: CarRentingPurpose[];
    monthly_leisure_spending_budget: MonthlyLeisureSpendingBudget;
    age_group: AgeGroup;
    gender: Gender;
    occupation: Occupation;
    driving_experience: DrivingExperience;
    life_stage: LifeStage;
}

export enum MonthlyLeisureSpendingBudget {
    below_two_thousand = "below_two_thousand",
    two_thousand_to_five_thousand = "two_thousand_to_five_thousand",
    five_thousand_to_eight_thousand = "five_thousand_to_eight_thousand",
    eight_thousand_to_ten_thousand = "eight_thousand_to_ten_thousand",
    above_ten_thousand = "above_ten_thousand",
}

export enum AgeGroup {
    eighteen_to_twenty_five = "eighteen_to_twenty_five",
    twenty_six_to_thirty_three = "twenty_six_to_thirty_three",
    thirty_four_to_forty_one = "thirty_four_to_forty_one",
    forty_two_to_forty_nine = "forty_two_to_forty_nine",
    fifty_years_and_older = "fifty_years_and_older"
}

export enum Gender {
    female = "female",
    male = "male"
}

export enum Occupation {
    professionals = "professionals",
    students = "students",
    administrators = "administrators",
    technicians = "technicians",
    service_industry_workers = "service_industry_workers",
    freelancers = "freelancers",
    drivers = "drivers",
    retirees = "retirees",
    unemployed_job_seekers = "unemployed_job_seekers",
    others = "others"
}

export enum DrivingExperience {
    two_to_five_years = "two_to_five_years",
    six_to_ten_years = "six_to_ten_years",
    eleven_to_fifteen_years = "eleven_to_fifteen_years",
    sixteen_to_twenty_years = "sixteen_to_twenty_years",
    above_twenty_years = "above_twenty_years",
}

export enum LifeStage {
    single = "single",
    married = "married",
    parents_with_children = "parents_with_children",
    pet_parents = "pet_parents",
}

export enum Area {
    kowloon = "kowloon",
    hong_kong = "hong_kong",
    new_territories = "new_territories"
}

export enum HongKongDistinct {
    kennedy_town = "kennedy_town",
    shek_tong_tsui = "shek_tong_tsui",
    sai_ying_pun = "sai_ying_pun",
    sheung_wan = "sheung_wan",
    central = "central",
    admiralty = "admiralty",
    mid_levels = "mid_levels",
    peak = "peak",
    wan_chai = "wan_chai",
    causeway_bay = "causeway_bay",
    happy_valley = "happy_valley",
    tai_hang = "tai_hang",
    so_kon_po = "so_kon_po",
    jardines_lookout = "jardines_lookout",
    tin_hau = "tin_hau",
    braemar_hill = "braemar_hill",
    north_point = "north_point",
    quarry_bay = "quarry_bay",
    sai_wan_ho = "sai_wan_ho",
    shau_kei_wan = "shau_kei_wan",
    chai_wan = "chai_wan",
    siu_sai_wan = "siu_sai_wan",
    pok_fu_lam = "pok_fu_lam",
    aberdeen = "aberdeen",
    ap_lei_chau = "ap_lei_chau",
    wong_chuk_hang = "wong_chuk_hang",
    shouson_hill = "shouson_hill",
    repulse_bay = "repulse_bay",
    chung_hom_kok = "chung_hom_kok",
    stanley = "stanley",
    tai_tam = "tai_tam",
    shek_o = "shek_o",
}

export enum KowloonDistinct {
    tsim_sha_tsui = "tsim_sha_tsui",
    yau_ma_tei = "yau_ma_tei",
    west_kowloon_reclamation = "west_kowloon_reclamation",
    kings_park = "kings_park",
    mong_kok = "mong_kok",
    tai_kok_tsui = "tai_kok_tsui",
    mei_foo = "mei_foo",
    lai_chi_kok = "lai_chi_kok",
    cheung_sha_wan = "cheung_sha_wan",
    sham_shui_po = "sham_shui_po",
    shek_kip_mei = "shek_kip_mei",
    yau_yat_tsuen = "yau_yat_tsuen",
    tai_wo_ping = "tai_wo_ping",
    stonecutters_island = "stonecutters_island",
    hung_hom = "hung_hom",
    to_kwa_wan = "to_kwa_wan",
    ma_tau_kok = "ma_tau_kok",
    ma_tau_wai = "ma_tau_wai",
    kai_tak = "kai_tak",
    kowloon_city = "kowloon_city",
    ho_man_tin = "ho_man_tin",
    kowloon_tong = "kowloon_tong",
    beacon_hill = "beacon_hill",
    san_po_kong = "san_po_kong",
    wong_tai_sin = "wong_tai_sin",
    tung_tau = "tung_tau",
    wang_tau_hom = "wang_tau_hom",
    lok_fu = "lok_fu",
    diamond_hill = "diamond_hill",
    tsz_wan_shan = "tsz_wan_shan",
    ngau_chi_wan = "ngau_chi_wan",
    ping_shek = "ping_shek",
    kowloon_bay = "kowloon_bay",
    ngau_tau_kok = "ngau_tau_kok",
    jordan_valley = "jordan_valley",
    kwun_tong = "kwun_tong",
    sau_mau_ping = "sau_mau_ping",
    lam_tin = "lam_tin",
    yau_tong = "yau_tong",
    lei_yue_mun = "lei_yue_mun"
}

export enum NewTerritoriesDistinct {
    kwai_chung = "kwai_chung",
    tsing_yi = "tsing_yi",
    tsuen_wan = "tsuen_wan",
    lei_muk_shue = "lei_muk_shue",
    ting_kau = "ting_kau",
    sham_tseng = "sham_tseng",
    tsing_lung_tau = "tsing_lung_tau",
    ma_wan = "ma_wan",
    sunny_bay = "sunny_bay",
    tai_lam_chung = "tai_lam_chung",
    so_kwun_wat = "so_kwun_wat",
    tuen_mun = "tuen_mun",
    lam_tei = "lam_tei",
    hung_shui_kiu = "hung_shui_kiu",
    ha_tsuen = "ha_tsuen",
    lau_fau_shan = "lau_fau_shan",
    tin_shui_wai = "tin_shui_wai",
    yuen_long = "yuen_long",
    san_tin = "san_tin",
    lok_ma_chau = "lok_ma_chau",
    kam_tin = "kam_tin",
    shek_kong = "shek_kong",
    pat_heung = "pat_heung",
    fanling = "fanling",
    luen_wo_hui = "luen_wo_hui",
    sheung_shui = "sheung_shui",
    shek_wu_hui = "shek_wu_hui",
    sha_tau_kok = "sha_tau_kok",
    luk_keng = "luk_keng",
    wu_kau_tang = "wu_kau_tang",
    tai_po_market = "tai_po_market",
    tai_po = "tai_po",
    tai_po_kau = "tai_po_kau",
    tai_mei_tuk = "tai_mei_tuk",
    shuen_wan = "shuen_wan",
    cheung_muk_tau = "cheung_muk_tau",
    kei_ling_ha = "kei_ling_ha",
    tai_wai = "tai_wai",
    sha_tin = "sha_tin",
    fo_tan = "fo_tan",
    ma_liu_shui = "ma_liu_shui",
    wu_kai_sha = "wu_kai_sha",
    ma_on_shan = "ma_on_shan",
    clear_water_bay = "clear_water_bay",
    sai_kung = "sai_kung",
    tai_mong_tsai = "tai_mong_tsai",
    tseung_kwan_o = "tseung_kwan_o",
    hang_hau = "hang_hau",
    tiu_keng_leng = "tiu_keng_leng",
    ma_yau_tong = "ma_yau_tong",
    cheung_chau = "cheung_chau",
    peng_chau = "peng_chau",
    lantau_island = "lantau_island",
    tung_chung = "tung_chung",
    lamma_island = "lamma_island",
}

export enum CarRentingPurpose {
    leisure = "leisure",
    for_work = "for_work",
    flexible = "flexible",
    long_term = "long_term",
    under_maintenance = "under_maintenance",
    pet_travel = "pet_travel",
    other = "other",
}

export enum CarType {
    diesel = "diesel",
    hybrid = "hybrid",
    electric = "electric",
    five_seater_car = "five_seater_car",
    seven_seater_car = "seven_seater_car",
}

export enum Plan {
    rent_to_buy = "rent_to_buy",
    six_plus_one = "six_plus_one",
    rent_with_park = "rent_with_park",
}

export enum Color {
    _000000 = "#000000",
    _FFFFFF = "#FFFFFF",
    _808080 = "#808080",
    _C0C0C0 = "#C0C0C0",
    _CEBFBD = "#CEBFBD",
    _A3C3D6 = "#A3C3D6",
    _B9E0C0 = "#B9E0C0",
    _496C6F = "#496C6F",
    _D31836 = "#D31836",
}


export interface CarData {
    id: number;
    data_type: DATA_TYPE.CAR_DATA;
    create_date: Date | string;
    disabled: Boolean;
    sold: Boolean;
    for_sale: Boolean;
    model: string;
    brand: string;
    engine: Engine;
    year: string;
    plate: string;
    color_code: string;
    color_zh_name: string;
    color_en_name: string;
    endurance: string;
    seat: string;
    fuel_consumption: string;
    equipment_list: string[]
    register_number: string;
    engine_number: string;
    chassis_number: string;
    tire_size: string;
    tire_brand: string;
    tire_model: string;
    category: string;
    odometer_value: string;
    cover_img_url_list: string[];
    other_img_url_list: string[];
    car_licence_url: string;
    car_licence_expiry_date: Date | string;
    insurance_url: string;
    insurance_expiry_date: Date | string;
    car_check_url: string;
    car_check_date: Date | string;
    other_doc_url_list: DocObject[];
    index: number | null;
    deposit: number;
    original_price_per_day: number;
    price_per_day: number;
    rent_to_buy_price: number;
    offer_plan_list: OfferPlan[];
    applicable_pickup_parking_id_list: number[];
    applicable_return_parking_id_list: number[];
    last_return_parking_id: number | null;
    current_location: string;
    remark: string;
    cc: string;
    head: string;
    hash_tag: string[];
    purchase_date: Date | string;
    purchase_price: number | null;
    received_date: Date | string;
    accumulated_rental_income: number; //after discount, no credit card service charge & no deposit
    accumulated_maintenance_cost: number;
    accumulated_repair_cost: number;
    registered: boolean;
    launched_date: Date | string;
    status_img_url_list: string[];
    car_damage_list: CarDamage[];
    prerent: Boolean;
    tutorial_html_content: string;
    vin: string;
    keyless_type: KeylessType | string;
    maximum_pick_time_to_allow_another_return: string;
    maximum_return_time_to_allow_another_pickup: string;
    starting_hour_to_allow_pickup: number;
    ending_hour_to_allow_return: number;
    minimun_hour_interval_between_pickup_return: number;
    minimum_booking_days: number;
    maximum_booking_days: number;
    price_per_odometer: number;
    included_odometer_per_month: number;
    insurance_price_tier_one_percentage: number;
    insurance_price_tier_two_percentage: number;
    ev_mac_address: string;
    dashcam_imei: string;
    obd_number: string;
    obd_device_id: string;
    insurance_type: InsuranceType;
    own_damage: number;
    theft_loss_excess: number;
    parking_damage_excess: number;
    third_party_property_excess: number;
    premium: number;
    keyless_tutorial_video_url: string;
    keyless_tutorial_website_url: string;
}

export enum Engine {
    diesel = "diesel",
    hybrid = "hybrid",
    electric = "electric"
}

export enum InsuranceType {
    third_party = "third_party",
    comprehensive = "comprehensive"
}

export interface OfferPlan {
    hide_total?: boolean;
    info?: string;
    minimum_rental_days: number;
    original_price: number;
    price_per_day: number;
    insurance_price_tier_one_percentage: number;
    insurance_price_tier_two_percentage: number;
}

export enum KeylessType {
    tesla = "tesla",
    gbox_v1 = "gbox_v1",
    gbox_v2 = "gbox_v2"
}

export interface CarDamage {
    category: CarDamageCategory;
    category_name: string;
    subcategory: CarDamageFrontSubcategory | CarDamageLeftSideSubcategory | CarDamageRightSideSubcategory | CarDamageRearSubcategory;
    subcategory_name: string;
    img_url_list: string[];
}

export enum CarDamageCategory {
    front = "front",
    left_side = "left_side",
    rear = "rear",
    right_side = "right_side"
}

export enum CarDamageFrontSubcategory {
    head_cover_or_front_cover = "head_cover_or_front_cover",
    headlamp = "headlamp",
    fog_lights = "fog_lights",
    head_pump_handle = "head_pump_handle",
    glass = "glass",
}

export enum CarDamageLeftSideSubcategory {
    front_sandboard = "front_sandboard",
    side_mirror = "side_mirror",
    front_door = "front_door",
    back_door = "back_door",
    skirt = "skirt",
    back_sandboard = "back_sandboard",
    glass = "glass",
    wheels = "wheels"
}

export enum CarDamageRightSideSubcategory {
    front_sandboard = "front_sandboard",
    side_mirror = "side_mirror",
    front_door = "front_door",
    back_door = "back_door",
    skirt = "skirt",
    back_sandboard = "back_sandboard",
    glass = "glass",
    wheels = "wheels"
}

export enum CarDamageRearSubcategory {
    tailgate = "tailgate",
    taillight = "taillight",
    fog_lights = "fog_lights",
    tail_pump_handle = "tail_pump_handle",
    glass = "glass",
}

export interface BlockingData {
    id: number;
    data_type: DATA_TYPE.BLOCKING_DATA;
    create_date: Date | string;
    disabled: Boolean;
    visible: Boolean;
    car_id: number | null;
    booking_date_list: string[];
    remark: string;
    excluded_user_id_list: number[];
    is_maintaining: boolean;
}

export interface ParkingData {
    id: number;
    data_type: DATA_TYPE.PARKING_DATA;
    create_date: Date | string;
    disabled: Boolean;
    rentable: Boolean;
    zh_category: string;
    en_category: string;
    zh_name: string;
    en_name: string;
    zh_address: string;
    en_address: string;
    zh_description: string;
    en_description: string;
    latitude: string;
    longitude: string;
    pick_up_charge: number | null;
    price_per_month: number | null;
    default: Boolean;
    car_id_list: number[];
    quota: number | null;
    show_in_app_filter: boolean;
    cover_img_url: string;
    img_url_list: string[];
    is_car_rental_point: boolean;
    minimum_booking_days: number;
    bnb_car_park_id: string;
    is_coming_soon: boolean;
    is_private: boolean;
    no_of_parking_space: number;
    poor_internet: boolean;
    district: Area;
    ace_parking_token: string;
    pickup_dropoff_remark: string;
    pickup_dropoff_img_url: string;
}

export interface OrderData {
    id: number;
    data_type: DATA_TYPE.ORDER_DATA;
    create_date: Date | string;
    disabled: Boolean;
    reference_number: string;
    user_id: number | null;
    second_driver_user_id: number | null;
    car_id: number | null;
    admin_id: number | null;
    booking_date_list: string[];
    start_date: string;
    end_date: string;
    invoice_url: string;
    contract_url: string;
    other_doc_url_list: DocObject[];
    status: OrderStatus;
    pick_up_data: CarPickingData;
    return_data: CarPickingData;
    parking_id: number | null;
    parking_data: ParkingData | null;
    equipment_id_list: number[];
    equipment_data_list: EquipmentData[];
    product_cart_list: ProductData[] | CartData[] | any;
    rental_amount: number | null;
    parking_amount: number | null;
    deposit_amount: number | null;
    equipment_amount: number | null;
    product_amount: number | null;
    insurance_amount: number | null;
    total_order_amount: number | null;
    payment_id_list: number[];
    remark: string;
    email_sent: Boolean;
    unpaid_email_sent: Boolean;
    campaign_data: CampaignData | null;
    insurance_tier: number | null;
}

export interface CartData {
    product_id: number;
    quantity: number;
    product_data: ProductData;
}

export enum OrderStatus {
    awaiting_payment = "awaiting_payment",
    awaiting_verification = "awaiting_verification",
    awaiting_pick_up = "awaiting_pick_up",
    rendering = "rendering",
    completed = "completed",
    cancelled = "cancelled",
}

export interface CarPickingData {
    parking_id: number;
    time: string;
    district: string;
    address: string;
    charge: string;
}


export interface PaymentData {
    id: number;
    data_type: DATA_TYPE.PAYMENT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    booking_date_list: string[];
    rental_amount: number | null;
    parking_amount: number | null;
    deposit_amount: number | null;
    equipment_amount: number | null;
    product_amount: number | null;
    penality_amount: number | null;
    coupon_amount: number | null;
    discount_amount: number | null;
    discount_type: DiscountType;
    allow_discount: Boolean;
    internal_discount_amount: number | null;
    internal_discount_amount_remark: string;
    internal_charge_amount: number | null;
    internal_charge_amount_remark: string;
    credit_card_extra_charge_amount: number | null;
    insurance_amount: number | null;
    total_amount: number | null;
    coupon_id: number | null;
    coupon_data: CouponData;
    user_id: number | null;
    car_id: number | null;
    order_id: number | null;
    payment_method: PaymentMethod | '',
    payment_order_data: JSON | null | any;
    expiry_date: Date;
    status: PaymentStatus;
    reference_number: string;
    remark: string;
    free_booking_days: number | null;
    joined_campaign: Boolean;
    invoice_url: string;
    payment_completed_datetime: Date | string;
    user_conduct_payment_email_sent: boolean;
}


export enum DiscountType {
    coupon = "coupon",
    deposit_discount = "deposit_discount",
    use_referral = "use_referral", //removed
    use_bonus = "use_bonus", //removed
}

export enum PaymentStatus {
    cancelled = "cancelled",
    awaiting_payment = "awaiting_payment",
    awaiting_verification = "awaiting_verification",
    paid = "paid"
}

export enum PaymentMethod {
    bank_transfer = "bank_transfer",
    credit_card = "credit_card",
    fps = "fps",
    alipayhk = "alipayhk"
}

export interface CouponData {
    id: number;
    data_type: DATA_TYPE.COUPON_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id_list: number[];
    car_id_list: number[];
    only_first_order: Boolean;
    zh_title: string;
    en_title: string;
    zh_description: string;
    en_description: string;
    img_url: string;
    code: string;
    reusable: Boolean;
    used: Boolean;
    start_date: Date | string;
    expiry_date: Date | string;
    discount_type: CouponDiscountType;
    discount_amount: number | null;
    remark: string;
    minimum_booking_days: number | null;
    maximum_booking_days: number | null;
    is_generated_by_system: boolean;
}

export enum CouponDiscountType {
    percentage = "percentage",
    price = "price"
}

export interface CampaignData {
    id: number;
    data_type: DATA_TYPE.CAMPAIGN_DATA;
    create_date: Date | string;
    disabled: Boolean;
    campaign_type: CampaignType;
    user_id_list: number[];
    car_id_list: number[];
    zh_title: string;
    en_title: string;
    zh_description: string;
    en_description: string;
    img_url: string;
    start_date: Date;
    expiry_date: Date;
    minimum_booking_days: number;
    maximum_booking_days: number;
    free_booking_days: number;
    percentage_off: number;
}

export enum CampaignType {
    percentage_off = "percentage_off",
    free_booking_days = "free_booking_days"
}

export interface DepositData {
    id: number;
    data_type: DATA_TYPE.DEPOSIT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    amount: number | null;
    // penalty: number | null;
    user_id: number | null;
    order_id: number | null;
    payment_id: number | null;
    application_date: Date;
    approval_date: Date;
    execution_date: Date;
    estimated_refund_date: Date;
    actual_refund_date: Date;
    status: DepositStatus;
    doc_url_list: DocObject[];
    remark: string;
    airwallex_payment_id: string;
    airwallex_short_reference_id: string;
}


export enum DepositStatus {
    awaiting_application = "awaiting_application",
    awaiting_execution = "awaiting_execution",
    executed = "executed",
    // awaiting_verification = "awaiting_verification",
    // approved = "approved",
    refunded = "refunded",
    confiscated = "confiscated"
}

export interface EquipmentData {
    id: number;
    data_type: DATA_TYPE.EQUIPMENT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_name: string;
    en_name: string
    category: string
    company: string
    price_per_month: number | null;
    applicable_car_id_list: number[];
    img_url_list: string[];
}

export interface ProductData {
    id: number;
    data_type: DATA_TYPE.PRODUCT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_name: string;
    en_name: string
    category: string
    price: number | null;
    inventory: number | null;
    company: string;
    applicable_car_id_list: number[];
    img_url_list: string[];
    incompatible_product_id_list: number[];
    minimum_booking_days: number | null;
    maximum_booking_days: number | null;
    quota: number | null;
}

export interface FactoryData {
    id: number;
    data_type: DATA_TYPE.FACTORY_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_name: string;
    en_name: string;
    phone: string;
    email: string;
    zh_address: string;
    en_address: string;
    latitude: string;
    longitude: string;
    cover_img_url_list: string[];
    working_hour_list: FactoryWorkingHour[];
    admin_only: boolean;
    applicable_car_id_list: number[];
}

export interface MaintenanceData {
    id: number;
    data_type: DATA_TYPE.MAINTENANCE_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_service_name: string;
    en_service_name: string;
    icon_url: string;
    free_once_per_month: Boolean;
    appliable_factory_id_list: number[];
    index: number | null;
    maintenance_category_list: MaintenanceCategoryList[];
    allow_user_booking: Boolean;
}

export interface MaintenanceCategoryList {
    maintenance_category_id: number;
    maintenance_category_data?: MaintenanceCategoryData;
    children: MaintenanceCategoryData[] | number[];
}

export interface MaintenanceCategoryData {
    id: number;
    data_type: DATA_TYPE.MAINTENANCE_CATEGORY_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_name: string;
    en_name: string;

}

export interface FactoryWorkingHour {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    allow_booking: Boolean;
    time: string;
    quota: number;
}

export interface AppointmentData {
    id: number;
    data_type: DATA_TYPE.APPOINTMENT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number | null;
    admin_id: number | null;
    order_id: number | null;
    car_id: number | null;
    maintenance_id: number | null;
    factory_id: number | null;
    factory_data: FactoryData | null;
    appointment_datetime: string;
    contact_name: string;
    contact_phone: string;
    remark: string;
    status: AppointmentStatus;
    type: "維修" | "保養項目";
    cost: number | null;
    maintenance_category_id: number | null;
    sub_maintenance_category_id: number | null;
    img_url_list: string[];
}

export enum AppointmentStatus {
    awaiting_verification = "awaiting_verification",
    accepted = "accepted",
    completed = "completed",
    cancelled = "cancelled"
}

export interface GiftData {
    id: number;
    data_type: DATA_TYPE.GIFT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_title: string;
    en_title: string;
    zh_description: string;
    en_description: string;
    used: Boolean;
    code: string;
    user_id: number | null;
}

export interface EmergencyData {
    id: number;
    data_type: DATA_TYPE.EMERGENCY_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number | null;
    order_id: number | null;
    car_id: number | null;
    accident_type: AccidentType;
    accident_datetime: Date | string;
    accident_location: string;
    weather: Weather | string,
    speed: string;
    witness: Boolean;
    witness_plate: string;
    witness_identity: string;
    witness_name: string;
    witness_phone: string;
    damage_level: "low" | "medium" | "high" | '';
    damage_img_url_list: string[];
    reported: Boolean;
    report_number: string;
    compensation_amount: number;
    payer: string;
    status: EmergencyStatus;
    remark: string;
    settlement_pdf_url: string;
    verify_code: string;
    request_datetime: Date | string;
    verified: Boolean;
    verified_datetime: string;
}

export enum EmergencyStatus {
    in_progress = "in_progress",
    completed = "completed"
}

export enum DamageLevel {
    low = "low",
    medium = "medium",
    high = "high"
}

export enum AccidentType {
    traffic_accident = "traffic_accident",
    vehicle_failure = "vehicle_failure"
}

export enum Weather {
    sunny = "sunny",
    rainy = "rainy",
    foggy = "foggy"
}

export interface ViolationData {
    id: number;
    data_type: DATA_TYPE.VIOLATION_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number | null;
    car_id: number | null;
    order_id: number | null;
    status: ViolationStatus;
    contravention_type: string;
    reference_number: string;
    violation_date: Date;
    payment_deadline_date: Date;
    pay_to_wasp: boolean;
    payment_method: PaymentMethod | '',
    payment_order_data: JSON | null | any;
    payment_completed_datetime: Date | string;
    payment_img_url_list: string[];
    other_doc_url_list: DocObject[];
    notification_date: Date;
    amount: number;
}

export enum ViolationStatus {
    cancelled = "cancelled",
    awaiting_payment = "awaiting_payment",
    awaiting_verification = "awaiting_verification",
    paid = "paid",
}


export interface NotificationData {
    id: number;
    data_type: DATA_TYPE.NOTIFICATION_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_title: string;
    en_title: string;
    zh_content: string;
    en_content: string;
    user_id_list: number[];
    admin_id_list: number[];
    notification_id_list: number[];
    hidden_user_id_list: number[];
    additional_data: OnesignalAdditionalData | null;
    website: string;
    image_url_android: string;
    image_url_ios: string;
    recipients: string;
}

export interface OnesignalAdditionalData {
    type: NotificationType
    car_id?: number;
    car_model?: number;
    payment_id?: number;
    order_id?: number;
    deposit_id?: number;
    appointment_id?: number;
    rbb_id?: number;
    violation_id?: number;
    compensation_payment_id?: number;
}

export enum NotificationType {
    change_order_status = "change_order_status",
    change_payment_status = "change_payment_status",
    violation_payment_reminder = "violation_payment_reminder",
    order_payment_reminder = "order_payment_reminder",
    favorite_car_reminder = "favorite_car_reminder",
    change_deposit_status = "change_deposit_status",
    change_appointment_status = "change_appointment_status",
    change_rbb_status = "change_rbb_status",
    change_violation_status = "change_violation_status",
    change_charge_status = "change_charge_status",
    change_car_viewing_status = "change_car_viewing_status",
    change_compensation_payment_status = "change_compensation_payment_status",
    seven_coupon = "seven_coupon"
}

export interface NotificationTemplateData {
    id: number;
    data_type: DATA_TYPE.NOTIFICATION_TEMPLATE_DATA;
    create_date: Date | string;
    disabled: Boolean;
    sms_content: string;
    zh_title: string;
    en_title: string;
    zh_content: string;
    en_content: string;
    website: string;
    image_url_android: string;
    image_url_ios: string;
}


export interface RbbData {
    id: number;
    data_type: DATA_TYPE.RBB_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number | null;
    car_id: number | null;
    order_id: number | null;
    rbb_payment_id: number | null;
    car_price: number | null;
    plan: RbbPlan | '';
    interest_rate: any[];
    mortgage_period: any[];
    selected_mortgage_period: any;
    first_payment_discount: Boolean;
    first_payment_discount_percentage: string;
    purchase_hybrid_care: Boolean;
    hybrid_care: Boolean;
    hybrid_care_amount: number | null;
    selected_plate_data: any;
    status: RbbStatus;
    status_history_list: RbbStatus[];
    equipment_id_list: number[];
    selected_equipment_id_list: number[];
    selected_equipment_data_list: RbbEquipmentData[];
    other_doc_url_list: DocObject[];
    rbb_agreement_url: string;
    rbb_confirm_url: string;
}

export interface DocObject {
    name: string;
    url: string;
    upload_date: Date | string;
}

export enum RbbPlan {
    cash = 'cash',
    loan = 'loan'
}

export enum RbbStatus {
    awaiting_application = "awaiting_application",
    awaiting_verification = "awaiting_verification",
    approved = "approved",
    rejected = "rejected",
    missing_documentation = "missing_documentation",
    pending = "pending",
    completed = "completed"
}


export interface RbbPaymentData {
    id: number;
    data_type: DATA_TYPE.RBB_PAYMENT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    rbb_id: number | null;
    user_id: number | null;
    car_id: number | null;
    order_id: number | null;
    payment_method: PaymentMethod,
    payment_order_data: JSON | null | any;
    plate_id: number | null;
    plate_data: PlateData | null;
    plate_amount: number | null;
    equipment_data_list: RbbEquipmentData[];
    equipment_amount: number | null;
    hybrid_care_amount: number | null;
    credit_card_extra_charge_amount: number | null;
    total_amount: number | null;
    status: RbbPaymentStatus;
    remark: string;
    payment_completed_datetime: Date;
}


export enum RbbPaymentStatus {
    cancelled = "cancelled",
    awaiting_payment = "awaiting_payment",
    awaiting_verification = "awaiting_verification",
    paid = "paid"
}

export interface PlateData {
    id: number;
    data_type: DATA_TYPE.PLATE_DATA;
    create_date: Date | string;
    disabled: Boolean;
    plate_number: number;
    price: string;
    sold: Boolean;
}

export interface RbbEquipmentData {
    id: number;
    data_type: DATA_TYPE.RBB_EQUIPMENT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_name: string;
    en_name: string;
    price: string;
}

export interface FaqData {
    id: number;
    data_type: DATA_TYPE.FAQ_DATA;
    create_date: Date | string;
    disabled: Boolean;
    zh_category: string;
    en_category: string;
    detail_list: FaqDataDetail[];
    index: number | null;
    icon_img_url: string;
}

export interface FaqDataDetail {
    zh_title: string;
    en_title: string;
    zh_content: string;
    en_content: string;
}


export interface AdminNotificationData {
    id: number;
    data_type: DATA_TYPE.FAQ_DATA;
    create_date: Date | string;
    disabled: Boolean;
    category: "預約維修" | "取車還車" | "先租後買" | "訂單付款" | "交通違例" | "緊急支援" | "退還按金" | "文件到期";
    description: string;
    read: Boolean;
    order_id: number | null;
    user_id: number | null;
    car_id: number | null;
    appointment_id: number | null;
    violation_id: number | null;
    rbb_id: number | null;
    deposit_id: number | null;
    emergency_id: number | null;
}

export interface LogData {
    id: number;
    data_type: DATA_TYPE.LOG_DATA;
    create_date: Date | string;
    disabled: Boolean;
    role: LogRole,
    role_id: number | null;
    username: string;
    category: LogCategory;
    target_data_id: number
    target_data_type: DATA_TYPE
    query: string;
}

export enum LogRole {
    admin = "admin",
    user = "user"
}

export enum LogCategory {
    create = "create",
    update = "update",
    delete = "delete"
}


export interface SevenCouponData {
    id: number;
    data_type: DATA_TYPE.SEVEN_COUPON_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number | null;
    code: string;
    amount: number | null;
    cover_img_url: string;
    used_cover_img_url: string;
    border_img_url: string;
    used: boolean;
    assign_datetime: Date | string;
    expiry_date: Date | string;
    seven_coupon_type: SevenCouponType;
}

export enum SevenCouponType {
    seven_eleven = "seven_eleven",
    islet_coffee_lab = "islet_coffee_lab"
}


export interface CustomPageData {
    id: number;
    data_type: DATA_TYPE.CUSTOM_PAGE_DATA;
    create_date: Date | string;
    release_date: Date | string;
    disabled: Boolean;
    shortlisted: Boolean;
    popular: Boolean;
    short_name: string;
    zh_title: string;
    en_title: string;
    zh_category: string;
    en_category: string;
    category_color: string;
    youtube_only: boolean;
    youtube_url: string;
    app_visible: boolean;
    web_visible: boolean;
    banner_img_url_list: string[];
    html_content: string;
    zh_button_title: string;
    en_button_title: string;
    link_to: '' | 'static_page' | 'url' | 'car' | 'custom_page';
    static_page_url: string;
    url: string;
    car_id: number | null;
    car_model: string;
    custom_page_id: number | null;
    extra_data: Object | null;
}

export interface NewFormData {
    id: number;
    data_type: DATA_TYPE.NEW_FORM_DATA;
    create_date: Date | string;
    last_update_datetime: Date | string;
    disabled: Boolean;
    company_name: string;
    content: string;
    email: string;
    name: string;
    phone: string;
    region: string;
    type: 'inquiry' | 'sell_car' | 'repair' | 'seller' | 'sponsor';
    model: string;
    year: string;
    image: string;
    address: string;
    br: string;
    product_type: string;
    sponsor_type: string;
}

export interface CompensationPaymentData {
    id: number;
    data_type: DATA_TYPE.COMPENSATION_PAYMENT_DATA;
    create_date: Date | string;
    last_update_datetime: Date | string;
    disabled: Boolean;
    order_id: number | null;
    user_id: number | null;
    car_id: number | null;
    quotation_datetime: Date | string;
    expiry_date: Date | string;
    payment_method: PaymentMethod | '',
    payment_order_data: JSON | null | any;
    payment_completed_datetime: Date | string;
    compensation_price: number | null;
    credit_card_extra_charge_amount: number | null;
    total_amount: number | null;
    status: CompensationPaymentStatus;
    remark: string;
    return_vehicle_report_pdf_url: string;
    quotation_pdf_url: string;
    return_vehicle_report_id: null;
    accident: Boolean;
    third_party_liability_amount: number;
    self_liability_amount: number;
}

export enum CompensationPaymentStatus {
    cancelled = "cancelled",
    awaiting_quotation = "awaiting_quotation",
    awaiting_payment = "awaiting_payment",
    awaiting_verification = "awaiting_verification",
    paid = "paid"
}

export interface CarViewingData {
    id: number;
    data_type: DATA_TYPE.CAR_VIEWING_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number;
    car_id: number;
    car_data: CarData;
    parking_id: number;
    parking_data: ParkingData;
    appointment_datetime: string;
    remark: string;
    status: CarViewingStatus;
    email_sent: Boolean;
}

export enum CarViewingStatus {
    accepted = "accepted",
    completed = "completed",
    cancelled = "cancelled"
}

export interface SmartCar {
    id: number;
    data_type: DATA_TYPE.SMART_CAR_DATA;
    create_date: Date | string;
    disabled: Boolean;
    vehicle_id: string;
    car_id: number;
    access_token: string;
    refresh_token: string;
    expiration: string;
    refresh_expiration: string;
    make: string;
    model: string;
    year: number;
    user: boolean;
    allow_user_access: boolean;
    user_token: string;
}

export interface VehicleRentalAgreement {
    id: number;
    data_type: DATA_TYPE.VEHICLE_RENTAL_AGREEMENT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    car_id: number;
    car_data: CarData;
    user_id: number;
    user_data: UserData;
    order_id: number;
    order_data: OrderData;
    admin_id: number;
    admin_username: string;
    car_damage_list: CarDamage[];
    oil_or_electricity_level: number;
    odometer: string;
    latitude: number;
    longitude: number;
    keyless_type: KeylessType | string;
    submitted: boolean;
    submitted_datetime: Date | string;
    remark: string;
    user_signature_img_url: string;
    feedbacks: string[];
    // odometer_value: string; revoked
}

export interface ReturnVehicleReport {
    id: number;
    data_type: DATA_TYPE.RETURN_VEHICLE_REPORT_DATA;
    create_date: Date | string;
    disabled: Boolean;
    car_id: number;
    car_data: CarData;
    user_id: number;
    user_data: UserData;
    order_id: number;
    order_data: OrderData;
    admin_id: number;
    admin_username: string;
    contract_status: string;
    deposit_status: string;
    car_damage_list: CarDamage[];
    oil_or_electricity_level: number;
    odometer: string;
    refilled: boolean;
    latitude: number;
    longitude: number;
    smoke_smell: boolean;
    keyless_type: KeylessType | string;
    submitted: boolean;
    submitted_datetime: Date | string;
    remark: string;
    check_report_remark: string;
    create_compensation: boolean;
    user_signature_img_url: string;
    parking_lot_reference_number: string;
    // gas_refill: boolean; revoked
    // mileage: string; revoked
}

export interface ChargeData {
    id: number;
    data_type: DATA_TYPE.CHARGE_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number | null;
    car_id: number | null;
    order_id: number | null;
    status: ChargeStatus;
    type: ChargeType;
    description: string;
    reference_number: string;
    date: Date;
    payment_method: PaymentMethod | '',
    payment_order_data: JSON | null | any;
    payment_completed_datetime: Date | string;
    payment_deadline_date: Date;
    other_doc_url_list: DocObject[];
    notification_date: Date;
    amount: number;
    penalty: number | null;
    remark: string;
    total_amount: number;
}

export enum ChargeStatus {
    awaiting_payment = "awaiting_payment",
    awaiting_verification = "awaiting_verification",
    paid = "paid",
    cancelled = "cancelled"
}

export enum ChargeType {
    hketoll_fee = "hketoll_fee",
    odometer_fee = "odometer_fee",
    late_drop_off_penalty = "late_drop_off_penalty",
    insufficient_battery_or_oil_penalty = "insufficient_battery_or_oil_penalty",
    incorrect_drop_off_location_penalty = "incorrect_drop_off_location_penalty",
    super_charge_idle_fee = "super_charge_idle_fee"
}


export interface PrerentCar {
    id: number;
    data_type: DATA_TYPE.PRERENT_CAR_DATA;
    create_date: Date | string;
    disabled: Boolean;
    enquiry_only: Boolean;
    series: string;
    brand: string;
    model: string;
    engine: Engine;
    year: string;
    endurance: string;
    seat: string;
    fuel_consumption: string;
    crossover_logo_url: string;
    confirm_banner_url: string;
    web_hor_banner_url: string;
    web_ver_banner_url: string;
    mobile_hor_banner_url: string;
    mobile_ver_banner_url: string;
    web_dark_contract_chart_url: string;
    web_light_contract_chart_url: string;
    mobile_dark_contract_chart_url: string;
    mobile_light_contract_chart_url: string;
    web_dark_network_url: string;
    web_light_network_url: string;
    mobile_dark_network_url: string;
    mobile_light_network_url: string;
    rent_to_buy_chart_url: string;
    rent_to_buy_web_chart_url: string;
    rent_to_buy_web_mobile_chart_url: string;
    minimum_booking_day_in_advance: number;
    maximum_booking_day_in_advance: number;
    preorder_deposit: number;
    deposit: number;
    color_option_list: PrerentColorOption[];
    plan_option_list: PrerentPlanOption[];
}

export interface PrerentColorOption {
    color_code: string;
    color_img_url: string;
    color_zh_name: string;
    color_en_name: string;
    cover_img_url: string;
    other_img_url_list: string[];
}

export interface PrerentPlanOption {
    rental_days: number;
    price_per_month: number;
}

export interface PrerentOrderData {
    id: number;
    data_type: DATA_TYPE.PRERENT_ORDER_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number | null;
    full_name: string;
    phone: string;
    email: string;
    call: "" | "Mr." | "Miss" | "Company";
    prerent_car_id: number | null;
    prerent_car_data: PrerentCar | null;
    prerent_color_option: PrerentColorOption | null;
    prerent_plan_option: PrerentPlanOption | null;
    parking_data: ParkingData | null;
    start_date: string;
    end_date: string;
    status: PrerentOrderStatus;
    payment_method: PaymentMethod | string,
    payment_order_data: JSON | null | any;
    payment_completed_datetime: Date | string;
    other_doc_url_list: DocObject[];
    amount: number;
    remark: string;
    email_sent: Boolean;
}

export enum PrerentOrderStatus {
    awaiting_payment = "awaiting_payment",
    awaiting_verification = "awaiting_verification",
    paid = "paid",
    cancelled = "cancelled",
    completed = "completed"
}

export interface AirwallexToken {
    id: number;
    data_type: DATA_TYPE.AIRWALLEX_TOKEN_DATA;
    create_date: Date | string;
    disabled: Boolean;
    expires_at: Date | string;
    token: string
}

export interface BnbCheckerQueueData {
    id: number;
    data_type: DATA_TYPE.BNB_CHECKER_QUEUE_DATA;
    create_date: Date | string;
    disabled: Boolean;
    queueing_car_id_list: number[];
}

export interface TeslaToken {
    id: number;
    data_type: DATA_TYPE.TESLA_TOKEN_DATA;
    create_date: Date | string;
    disabled: Boolean;
    access_token: string;
    refresh_token: string;
    expiration: string;
    token: string
}

export interface OccupancyRecord {
    id: number;
    data_type: DATA_TYPE.OCCUPANCY_RECORD_DATA;
    create_date: Date | string;
    disabled: Boolean;
    occupancy_rate: string;
    rentable_car_list: JSON[];
    booked_car_list: JSON[];
    blocked_car_list: JSON[];
    blocked_maintaining_car_list: JSON[];
}

export interface InspectionData {
    id: number;
    data_type: DATA_TYPE.INSPECTION_DATA;
    create_date: Date | string;
    disabled: Boolean;
    status: InspectionStatus;
    admin_id: number;
    user_id: number;
    order_id: number;
    rvr_id: number;
    parking_id: number;
    car_id: number;
    model: string;
    brand: string;
    plate: string;
    parking_lot_reference_number: string;
    keyless_type: KeylessType;
    obd_number: string;
    car_img_url_list: string[];
    inspection_car_damage_list: InspectionCarDamage[];
    return_datetime: Date | string;
    inspection_start_datetime: Date | string;
    inspection_end_datetime: Date | string;
    next_order_datetime: Date | string;
    rating: number;
    remove_from_fleet: boolean;
    remove_from_fleet_remark: string;
    remove_from_fleet_email_sent: string;
    printed: boolean;
}

export enum InspectionStatus {
    pending = "pending",
    in_progress = "in_progress",
    result_generated = "result_generated",
    completed = "completed",
    cancelled = "cancelled",
    expired = "expired"
}

export interface InspectionCarDamage {
    section: string;
    category: string;
    img_url_list: string[];
    remark: string;
}

export interface CreditCardFailureData {
    id: number;
    data_type: DATA_TYPE.CREDIT_CARD_FAILURE_DATA;
    create_date: Date | string;
    disabled: Boolean;
    user_id: number;
    stored_payment_method_id: string;
    payment_method: string;
    event_date: string;
    merchant_reference: string;
    additional_data: any | null;
}