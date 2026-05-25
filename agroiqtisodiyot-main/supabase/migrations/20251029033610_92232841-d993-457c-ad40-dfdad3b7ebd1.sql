-- Create editorial board members table
CREATE TABLE public.editorial_board (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.editorial_board ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view editorial board"
ON public.editorial_board
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert editorial board members"
ON public.editorial_board
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can update editorial board members"
ON public.editorial_board
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete editorial board members"
ON public.editorial_board
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Insert initial editorial board members
INSERT INTO public.editorial_board (name, position, order_index) VALUES
('Nazimjon ASKAROV', 'Bosh Muharrir', 1),
('Alisher SHUKUROV', 'Tahrir hay''ati a''zosi', 2),
('Akmal QOSIMOV', 'Tahrir hay''ati a''zosi', 3),
('Shoxrux AKRAMOV', 'Tahrir hay''ati a''zosi', 4),
('Sandasror GULOMOV', 'Tahrir hay''ati a''zosi', 5),
('Norkul ХЎШMATOV', 'Tahrir hay''ati a''zosi', 6),
('Rajaboy ALMURATOV', 'Tahrir hay''ati a''zosi', 7),
('Tulkin FARMANOV', 'Tahrir hay''ati a''zosi', 8),
('Fotima NAZAROV', 'Tahrir hay''ati a''zosi', 9),
('Iroda RUSTAMOVA', 'Tahrir hay''ati a''zosi', 10),
('Яшнажон ALIEV', 'Tahrir hay''ati a''zosi', 11),
('Абдуъолиқ МУХTOROV', 'Tahrir hay''ati a''zosi', 12),
('Мусаххан КОСИМОВ', 'Tahrir hay''ati a''zosi', 13),
('Isroiljon ХОЛМИРЗАЕВ', 'Tahrir hay''ati a''zosi', 14),
('Аслиддин АБДУЛЛОЕВ', 'Tahrir hay''ati a''zosi', 15),
('Тиҳом ОЧИЛОВ', 'Tahrir hay''ati a''zosi', 16),
('Akmal NOROV', 'Tahrir hay''ati a''zosi', 17),
('Бахтиёр МEНГЛИҚУLOV', 'Tahrir hay''ati a''zosi', 18),
('Зебо ШОХУЖАЕВА', 'Tahrir hay''ati a''zosi', 19),
('Зибахан СЕЙТИМБЕТОВА', 'Tahrir hay''ati a''zosi', 20),
('Улуғбек САДУЛЛАЕВ', 'Tahrir hay''ati a''zosi', 21),
('Дилшод ЯНТИМОЕВ', 'Tahrir hay''ati a''zosi', 22),
('Абдурауф ОБЛОКУЛОВ', 'Tahrir hay''ati a''zosi', 23),
('Нодир ЖАНИБЕКОВ', 'Tahrir hay''ati a''zosi', 24);